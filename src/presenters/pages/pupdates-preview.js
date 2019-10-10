import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { withRouter } from 'react-router-dom';

import PreviewContainer from 'Components/containers/preview-container';
import DataLoader from 'Components/data-loader';
import Link from 'Components/link';

import { useAPI } from 'State/api';
import { useGlobals } from 'State/globals';

import { NewStuffOverlay } from 'Components/new-stuff';

const PupdatesPreview = withRouter(({ history }) => {
  const api = useAPI();
  const [currentDraft, setCurrentDraft] = useState(0);
  const { origin } = useGlobals();
  const onPublish = async (data) => {
    try {
      await api.post(`${origin}/api/pupdate`, data);
      history.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  const changeDraft = (e) => {
    setCurrentDraft(e.target.value);
  };

  return (
    <main>
      <Helmet title="Glitch Pupdates Previewer" />
      <DataLoader get={() => api.get('https://cms.glitch.me/drafts.json').then((res) => res.data)}>
        {(drafts) => (
          <>
            <div style={{ position: 'sticky', top: '0', background: '#fff', padding: '10px 0' }}>
              <h2>Select a draft</h2>
              <select onChange={changeDraft} value={currentDraft}>
                {drafts.map((draft, i) => (
                  <option key={draft.id} value={i}>
                    {draft.label}
                  </option>
                ))}
              </select>
            </div>

            <PreviewContainer
              get={() => api.get(`https://cms.glitch.me/drafts/${drafts[currentDraft].id}/pupdate.json`).then((res) => res.data)}
              previewMessage={
                <>
                  This is a live preview of Pupdates in the \"{drafts[currentDraft].label}\" draft. To publish this draft, go back to{' '}
                  <Link to="https://glith.prismic.io">Prismic</Link>.
                </>
              }
            >
              {(data) => <NewStuffOverlay showNewStuff setShowNewStuff={() => {}} newStuff={data.pupdates} closePopover={() => {}} />}
            </PreviewContainer>
          </>
        )}
      </DataLoader>
    </main>
  );
});
export default PupdatesPreview;
