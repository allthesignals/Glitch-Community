import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import PreviewContainer from 'Components/containers/preview-container';
import DataLoader from 'Components/data-loader';
import Link from 'Components/link';

import { useAPI } from 'State/api';

import { NewStuffOverlay } from 'Components/new-stuff';

<<<<<<< HEAD
const PupdatesPreview = (() => {
  const api = useAPI();
  const [currentDraft, setCurrentDraft] = useState(0);

  const changeDraft = (e) => {
    setCurrentDraft(e.target.value);
=======
const PupdatesPreview = withRouter(() => {
  const api = useAPI();
  const { origin } = useGlobals();
  const onPublish = async (data) => {
    try {
      await api.post(`${origin}/api/pupdate`, data);
      window.location = '/';
    } catch (e) {
      console.error(e);
    }
>>>>>>> 0e316cb89e0da1603ddee0d4ed41fb7ab0f0cb81
  };

  return (
    <main style={{ padding: '0 1em' }}>
      <Helmet title="Glitch Pupdates Previewer" />
      <DataLoader get={() => api.get('https://cms.glitch.me/drafts.json').then((res) => res.data)}>
        {(drafts) => (
          <>
<<<<<<< HEAD
            <div>
              <h2>Select a draft</h2>
              <select onChange={changeDraft} value={currentDraft}>
                {drafts.map((draft, i) => (
                  <option key={draft.id} value={i}>
                    {draft.label}
                  </option>
                ))}
              </select>
              &nbsp;
              <Link to="/index/preview">Preview the home page</Link>
            </div>

            <PreviewContainer
              get={() => api.get(`https://cms.glitch.me/drafts/${drafts[currentDraft].id}/pupdates.json`).then((res) => res.data)}
              previewMessage={
                <>
                  This is a live preview of Pupdates in the &quot;{drafts[currentDraft].label}&quot; draft. To publish this draft, go back to{' '}
                  <Link to="https://glitch.prismic.io">Prismic</Link>.
                </>
              }
            >
              {(data) => <NewStuffOverlay showNewStuff setShowNewStuff={() => {}} newStuff={data.pupdates} closePopover={() => {}} />}
            </PreviewContainer>
=======
            This is a live preview of edits done with the <Link to="https://pupdates-editor.glitch.me">Pupdates Editor.</Link>
            <br />
            If you aren't logged in, <Link to="/">Go Home</Link> and then come back here to publish!
>>>>>>> 0e316cb89e0da1603ddee0d4ed41fb7ab0f0cb81
          </>
        )}
      </DataLoader>
    </main>
  );
});
export default PupdatesPreview;
