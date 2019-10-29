import React from 'react';

const Row = ({ dataset, index }) => {
  const columns = dataset.map((column) => (
    <div key={column} className="column">
      Column {column}
    </div>
  ));

  const handleInput1Change = (e) => {
    document.dispatchEvent(
      new CustomEvent('inputUpdate', {
        detail: {
          rowIndex: index,
          colIndex: dataset.length - 2,
          value: e.target.value,
        },
      }),
    );
  };

  const handleInput2Change = (e) => {
    document.dispatchEvent(
      new CustomEvent('inputUpdate', {
        detail: {
          rowIndex: index,
          colIndex: dataset.length - 1,
          value: e.target.value,
        },
      }),
    );
  };

  return (
    <div className="row" draggable>
      <div className="column title">Row</div>
      {columns}
      <input
        className="column input"
        type="text"
        value={dataset[dataset.length - 2]}
        onChange={handleInput1Change}
      />
      <input
        className="column input"
        type="text"
        value={dataset[dataset.length - 1]}
        onChange={handleInput2Change}
      />
    </div>
  );
};

export default Row;
