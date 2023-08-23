import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReloadProvider } from './components/reloadContext';
import App from './components/App';
import { Auth0Provider } from  '@auth0/auth0-react'; 

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://traveltracker.com",
      scope: "openid profile email",
    }}
    >
      <ReloadProvider>
        <App />
      </ReloadProvider>
  </Auth0Provider>
);


