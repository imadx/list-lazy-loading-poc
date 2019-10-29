import React from 'react';
import Row from './Row';

const getRows = (dataset) => {
  return dataset.map((row, i) => {
    return <Row key={row[0]} index={i} dataset={row} />;
  });
};

const List = ({ pagedDataset }) => {
  return Object.keys(pagedDataset).map((pageIndex) => {
    return (
      <div id={`page-index-${pageIndex}`} className="paged-result" key={pageIndex} data-page-index={pageIndex}>
        {getRows(pagedDataset[pageIndex])}
      </div>
    );
  });
};

export default List;
