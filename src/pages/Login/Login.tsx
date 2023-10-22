import React from 'react';
import { AzureAD, AuthenticationState, IAccountInfo } from 'react-aad-msal';
import { authProvider } from '../../authProvider';
import App from '../../App';
import { Button } from '@mui/material';

const Login: React.FC = () => {
  return (
    <div className="App">
      <AzureAD provider={authProvider}></AzureAD>

      <AzureAD provider={authProvider} forceLogin={true}>
        {({
          login,
          logout,
          authenticationState,
          error,
          accountInfo
        }: {
          login: () => void;
          logout: () => void;
          authenticationState: AuthenticationState;
          error: any;
          accountInfo: IAccountInfo;
        }) => {
          switch (authenticationState) {
            case AuthenticationState.Authenticated:
              return (
                <>
                  <div className='d-flex justify-content-between p-2'>
                    <span className='mt-2'>Welcome, {accountInfo.account.name}!</span>
                    {/* <span>{accountInfo.jwtIdToken}</span> */}
                    <Button variant="contained" onClick={logout}>Logout</Button>
                  </div>
                  <App authenticationState={authenticationState} />
                </>
              );
            case AuthenticationState.Unauthenticated:
              return (
                <div>
                  {error && (
                    <p>
                      <span>An error occurred during authentication, please try again!</span>
                    </p>
                  )}
                  <p>
                    <span>Hey stranger, you look new!</span>
                    <button onClick={login}>Login</button>
                  </p>
                </div>
              );
            case AuthenticationState.InProgress:
              return <p>Authenticating...</p>;
            default:
              return null;
          }
        }}
      </AzureAD>
    </div>
  );
};

export default Login;
