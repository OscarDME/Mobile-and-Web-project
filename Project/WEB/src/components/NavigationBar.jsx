import { Nav, Navbar, Dropdown, DropdownButton, Button } from 'react-bootstrap';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { InteractionStatus } from "@azure/msal-browser"; 
import { loginRequest, b2cPolicies } from '../authConfig';
import logo from '../assets/Logo.svg';
import '../styles/App.css';

export const NavigationBar = () => {
    const { instance, inProgress } = useMsal();
     let activeAccount;

     if (instance) {
         activeAccount = instance.getActiveAccount();
     }

    const handleLoginPopup = () => {
        instance
            .loginPopup({
                ...loginRequest,
                redirectUri: '/redirect',
            })
            .catch((error) => console.log(error));
    };

    const handleLoginRedirect = () => {
        instance.loginRedirect(loginRequest).catch((error) => console.log(error));
    };

    const handleLogoutRedirect = () => {
        instance.logoutRedirect();
    };

    const handleLogoutPopup = () => {
        instance.logoutPopup({
            mainWindowRedirectUri: '/', // redirects the top level app after logout
        });
    };

    const handleProfileEdit = () => {
        if(inProgress === InteractionStatus.None){
           instance.acquireTokenRedirect(b2cPolicies.authorities.editProfile);
        }
    };
    
    return (
        <>
            <Navbar bg="#D8F2FE" className="navbarStyle">
                <a className="navbar-brand" href="/">
                    <img
                        src={logo}
                        alt="Logo"
                        height="65" 
                        className="d-inline-block align-top"
                    />
                </a>
                <AuthenticatedTemplate>
                    <div className="collapse navbar-collapse justify-content-end">
                        <Button variant="info" onClick={handleProfileEdit} className="profileButton">
                            Edit Profile
                        </Button>
                        <Button className="ml-auto cta-button"
                            onClick={handleLogoutRedirect}>
                                Cerrar sesion: {activeAccount && activeAccount.username ? activeAccount.username : 'Unknown'}
                        </Button>
                    </div>
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <div className="collapse navbar-collapse justify-content-end">
                        <Button  className="ml-auto cta-button"onClick={handleLoginRedirect}>
                                Iniciar sesion
                        </Button>
                    </div>
                </UnauthenticatedTemplate>
            </Navbar>
        </>
    );
};
