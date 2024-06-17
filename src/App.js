import React, { useState } from 'react';
import './index.css';
import SearchPopup from './SearchPopup';
import DragDropInterface from './DragDropInterface';

const App = () => {
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleSelectProduct = (productId) => {
    setSelectedProductId(productId);
  };

  return (
    <div>
      <h1>ATDW Content Display Project</h1>
      {selectedProductId ? (
        <DragDropInterface productId={selectedProductId} />
      ) : (
        <SearchPopup onSelectProduct={handleSelectProduct} />
      )}
    </div>
  );
};

export default App;
