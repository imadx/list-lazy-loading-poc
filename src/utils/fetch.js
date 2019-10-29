import { PAGE_SIZE, MAX_PAGE_LIMIT } from '../constants';
let cachedDataset = {};
const cachedPagedResults = {};

window.cachedDataset = cachedDataset;
window.cachedPagedResults = cachedPagedResults;

const getExpandPageRange = ({ pageRange, isScrollingUp, totalDataCount }) => {
  let [start, end] = pageRange;
  if (isScrollingUp) {
    start = Math.max(start - 1, 1);
    if (end - start >= MAX_PAGE_LIMIT) {
      end = start + MAX_PAGE_LIMIT - 1;
    }
  } else {
    end = Math.min(end + 1, Math.ceil(totalDataCount / PAGE_SIZE));
    if (end - start >= MAX_PAGE_LIMIT) {
      start = end - MAX_PAGE_LIMIT + 1;
    }
  }

  return [start, end];
};

const getStartEndIndexesForPageIndex = (pageIndex) => {
  return [(pageIndex - 1) * PAGE_SIZE, pageIndex * PAGE_SIZE];
};

const getPageResults = (pageIndex, url) => {
  const dataset = cachedDataset[url];
  const [startIndex, endIndex] = getStartEndIndexesForPageIndex(pageIndex);

  return dataset.slice(startIndex, endIndex);
};

async function fetchData({ pageRange, isScrollingUp = false }) {
  const url = '/mock/data.json';
  if (!cachedDataset[url]) {
    const response = await fetch(url);
    cachedDataset[url] = await response.json();

    cachedPagedResults[url] = {};
  }

  const totalDataCount = cachedDataset[url].length;
  const expandedPageRange = getExpandPageRange({ pageRange, isScrollingUp, totalDataCount });

  const pagedResults = {};
  const [pageRangeStart, pageRangeEnd] = expandedPageRange;

  for (let pageIndex = pageRangeStart; pageIndex <= pageRangeEnd; pageIndex += 1) {
    if (!cachedPagedResults[url][pageIndex]) {
      const result = getPageResults(pageIndex, url);

      cachedPagedResults[url][pageIndex] = result;
      pagedResults[pageIndex] = result;
    }
    pagedResults[pageIndex] = cachedPagedResults[url][pageIndex];
  }

  return [pagedResults, expandedPageRange];
}

export default fetchData;
