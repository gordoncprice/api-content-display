import React, { useState } from 'react';
import axios from 'axios';

const SearchPopup = ({ onSelectProduct }) => {
  const [productName, setProductName] = useState('');
  const [state, setState] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const states = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];

  const searchProducts = async () => {
    setSearchAttempted(false); // Temporarily set searchAttempted to false
    console.log('Search button clicked'); // Debugging log
    console.log(`Searching for product: ${productName}, state: ${state}`); // Debugging log
    try {
      const response = await axios.get('https://atlas.atdw-online.com.au/api/atlas/products', {
        params: {
          key: 'ATDW001',
          additionalQuery: `productName:("${productName}")`,
          st: state,
          out: 'json'  // Ensure the output is in JSON
        }
      });
      console.log('API response:', response.data); // Debugging log
      const products = response.data.products || [];
      setSearchResults(products);
      setSearchAttempted(true); // Set searchAttempted to true after setting the results
      console.log('Search results set:', products); // Debugging log
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err); // Debugging log
      setError(err);
      setSearchAttempted(true); // Set searchAttempted to true even if there is an error
    }
  };

  return (
    <div className="search-popup">
      <h2>Search Products</h2>
      <div className="search-field">
        <label>Product Name:</label>
        <input 
          type="text" 
          value={productName} 
          onChange={(e) => setProductName(e.target.value)} 
        />
      </div>
      <div className="search-field">
        <label>State:</label>
        <select value={state} onChange={(e) => setState(e.target.value)}>
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
      <button onClick={searchProducts}>Search</button>
      {error && <p>Error: {error.message}</p>}
      <div className="search-results">
        {searchAttempted && searchResults.length === 0 && (
          <p>No results found</p>
        )}
        {searchResults.map((product) => (
          <div 
            key={product.productId} 
            onClick={() => onSelectProduct(product.productId)}
            className="search-result-item"
          >
            {product.productName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPopup;
