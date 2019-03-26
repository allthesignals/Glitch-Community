import React from 'react';
import PropTypes from 'prop-types';

import randomColor from 'randomcolor';
import { sample } from 'lodash';

import ErrorBoundary from './includes/error-boundary';
import { Link } from './includes/link';
import QuestionItem from './question-item';
import { captureException } from '../utils/sentry';
import { useAPI, createAPIHook } from '../state/api';

import Heading from '../components/text/heading';

const kaomojis = ['八(＾□＾*)', '(ノ^_^)ノ', 'ヽ(*ﾟｰﾟ*)ﾉ', '♪(┌・。・)┌', 'ヽ(๏∀๏ )ﾉ', 'ヽ(^。^)丿'];

const QuestionTimer = ({ animating, callback }) => (
  <div className="loader-pie" title="Looking for more questions...">
    <div className="left-side">
      <div className={`slice ${animating ? 'animated' : ''}`} onAnimationEnd={callback} />
    </div>
    <div className="right-side">
      <div className={`slice ${animating ? 'animated' : ''}`} />
    </div>
  </div>
);
QuestionTimer.propTypes = {
  animating: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
};

const useQuestionsAPI = createAPIHook(async (api, max) => {
  try {
    const { data } = await api.get('projects/questions');
    const questions = data
      .map((q) => JSON.parse(q.details))
      .filter((q) => !!q)
      .slice(0, max)
      .map((question) => {
        const [colorInner, colorOuter] = randomColor({
          luminosity: 'light',
          count: 2,
        });
        return { colorInner, colorOuter, ...question };
      });
    return {
      kaomoji: sample(kaomojis),
      questions,
    };
  } catch (error) {
    console.error(error);
    captureException(error);
    return { kaomoji: sample(kaomojis), questions: [] };
  }
});

function Questions({ max }) {
  const { status  } = useQuestionsAPI(max);
}

class Questions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kaomoji: '',
      loading: true,
      questions: [],
    };
  }

  componentDidMount() {
    this.load();
  }

  async load() {
    this.setState({ loading: true });
  }

  render() {
    const { kaomoji, loading, questions } = this.state;
    return (
      <section className="questions">
        <Heading tagName="h2">
          <Link to="/questions">Help Others, Get Thanks →</Link> <QuestionTimer animating={!loading} callback={() => this.load()} />
        </Heading>
        <article className="projects">
          {questions.length ? (
            <ErrorBoundary>
              <ul className="projects-container">
                {questions.map((question) => (
                  <li key={question.questionId}>
                    <QuestionItem {...question} />
                  </li>
                ))}
              </ul>
            </ErrorBoundary>
          ) : (
            <>
              {kaomoji} Looks like nobody is asking for help right now.{' '}
              <Link className="general-link" to="/help/how-can-i-get-help-with-code-in-my-project/">
                Learn about helping
              </Link>
            </>
          )}
        </article>
      </section>
    );
  }
}
Questions.propTypes = {
  max: PropTypes.number,
};
Questions.defaultProps = {
  max: 3,
};

const QuestionsWrap = (props) => {
  const api = useAPI();
  return <Questions {...props} api={api} />;
};

export default QuestionsWrap;
