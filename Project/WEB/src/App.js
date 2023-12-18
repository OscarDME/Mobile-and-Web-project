import './App.css';
import { useMsal, MsalProvider, AuthenticatedTemplate,UnauthenticatedTemplate } from '@azure/msal-react';
import { loginRequest } from './auth/authConfig';


const WrappedView = () => {
  const {instance} = useMsal();
  const activeAccount = instance.getActiveAccount();

  const handleRedirect = () => {
    instance.loginPopup({
      ...loginRequest,
    prompt: 'create',
    })
    .catch((error) => console.log(error));
  };

const handleLogout = () => {
  instance.logoutPopup();
}


  return (
    <div className="App">
      <AuthenticatedTemplate>
        {activeAccount ? (<div>Welcome {activeAccount.name}
        <div>Want to log out?
        <button onClick={handleLogout}>Logout</button>
        </div> 
        </div>
        )
        : (<div>Please login</div>)}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <button onClick={handleRedirect}>Login</button>
      </UnauthenticatedTemplate>
    </div>
  );
};

const App = ({instance}) => {
  return (
    <MsalProvider instance={instance}>
      <WrappedView></WrappedView>
    </MsalProvider>
    )
};
export default App;
