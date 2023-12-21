import './App.css';
import { useMsal, MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { loginRequest } from './auth/authConfig';

const WrappedView = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const handleLoginRedirect = () => {
    instance.loginRedirect({
      ...loginRequest,
      prompt: 'select_account',
    });
  };

  const handleLogout = () => {
    instance.logoutRedirect();
  }

  return (
    <div className="App">
      <AuthenticatedTemplate>
        {activeAccount ? (
          <div className="WelcomeContainer">
            <div>Welcome {activeAccount.name} - Username: {activeAccount.username} - OID: {activeAccount.idTokenClaims.oid}</div>
            <div>
              Want to log out?
              <button className="LogoutButton" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <div>Please login</div>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div className="LoginContainer">
          <h2>Login to Your Account</h2>
          <button className="LoginButton" onClick={handleLoginRedirect}>Login</button>
        </div>
      </UnauthenticatedTemplate>
    </div>
  );
};

const App = ({ instance }) => {
  return (
    <MsalProvider instance={instance}>
      <WrappedView></WrappedView>
    </MsalProvider>
  )
};

export default App;
