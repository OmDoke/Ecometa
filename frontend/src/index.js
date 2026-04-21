import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';  // Ensure only one Router here
import App from './App';
import './index.css';

ReactDOM.render(
  <Router>  {/* Only one Router should be here */}
    <App />
  </Router>,
  document.getElementById('root')
);
