import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';


const domain = "dev-ruqfkpi56agdyyjh.us.auth0.com";
const clientId = "qeguO3bbLhmfWujbY8eXclksQorLBCZR";
const audience = "https://mycryptoworld/api"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <App />
  </Auth0Provider>
      
    
 
    
  </React.StrictMode>
);

/*
orryawatramani176
QDPrEA70iBtXs5Q6
*/