import React, { useEffect, useState } from 'react';
import fetchData from '../utils/fetch';

import List from './List';

const App = () => {
  const [pageRange, setPageRange] = useState([1, 1]);
  const [data, setData] = useState([]);
  const [hideOverlay, setHideOverlay] = useState(false);

  const fetchDataAsync = async (args) => {
    const { isScrollingUp } = args || {};
    const [updatedDataset, updatedPageRange] = await fetchData({ pageRange, isScrollingUp });
    setPageRange(updatedPageRange);
    setData(updatedDataset);
  };

  const upperBoundCallback = function() {
    const topmostPage = pageRange[0];
    if (topmostPage === 1) {
      return;
    }

    fetchDataAsync({
      isScrollingUp: true,
    });

    requestAnimationFrame(() => {
      document.getElementById(`page-index-${topmostPage}`).scrollIntoView(true);
    });
  };

  function lowerBoundCallback() {
    fetchDataAsync();
  }

  function scrollHandlerCallback(e) {
    const { firstChild: upperBoundTarget, lastChild: lowerBoundTarget } = e.target;
    const scrollAreaRect = e.target.getBoundingClientRect();
    const lowerBoundTargetRect = lowerBoundTarget.getBoundingClientRect();
    const shouldLoadRowsBelow =
      lowerBoundTargetRect.top >= scrollAreaRect.top &&
      lowerBoundTargetRect.bottom <= scrollAreaRect.height + scrollAreaRect.top;

    if (shouldLoadRowsBelow) {
      return lowerBoundCallback();
    }

    const upperBoundTargetRect = upperBoundTarget.getBoundingClientRect();
    const shouldLoadRowsAbove =
      upperBoundTargetRect.top >= scrollAreaRect.top &&
      upperBoundTargetRect.bottom <= scrollAreaRect.height + scrollAreaRect.top;

    if (shouldLoadRowsAbove) {
      return upperBoundCallback();
    }
  }

  // initial data fetch
  useEffect(() => {
    fetchDataAsync();
  }, []);

  // scroll handlers
  useEffect(() => {
    const scrollArea = document.getElementById('scroll-area');
    scrollArea.addEventListener('scroll', scrollHandlerCallback);

    return () => {
      scrollArea.removeEventListener('scroll', scrollHandlerCallback);
    };
  }, [pageRange]);

  const handleOverlayToggling = () => {
    setHideOverlay(!hideOverlay);
  };

  return (
    <>
      <div className="meta-information">
        <div>
          <h1>List lazy loading</h1>
        </div>
        <div className="list-stats">
          <button onClick={handleOverlayToggling}>Toggle Overlays</button>
          <div>Overlays are {hideOverlay ? 'hidden' : 'visible'}</div>
          <div>pageRange: {pageRange.join(',')}</div>
          <div>pages in dataset: {Object.keys(data).join(',')}</div>
        </div>
      </div>
      <div id="scroll-area" className={`scroll-area${hideOverlay ? ' hide-overlays' : ''}`}>
        <div id="upper-bound" className="upper-bound">
          Upper Bound
        </div>
        <List pagedDataset={data} />
        <div id="lower-bound" className="lower-bound">
          Lower Bound
        </div>
      </div>
    </>
  );
};

export default App;
