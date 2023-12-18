import './App.css';
import { useMsal, MsalProvider, AuthenticatedTemplate,UnauthenticatedTemplate } from '@azure/msal-react';
import { loginRequest } from './auth/authConfig';


const WrappedView = () => {
  const {instance} = useMsal();
  const activeAccount = instance.getActiveAccount();

  const handleRedirect = () => {
    instance.loginRedirect({
      ...loginRequest,
    prompt: 'create',
    })
    .catch((error) => console.log(error));
  };


  return (
    <div className="App">
      <AuthenticatedTemplate>
        {activeAccount ? (<div>Welcome {activeAccount.name}</div>)
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
