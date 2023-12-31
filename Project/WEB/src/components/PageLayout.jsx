import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { NavigationBar } from "./NavigationBar";

export const PageLayout = (props) => {
    return (
        <>
            <NavigationBar />
            <UnauthenticatedTemplate>
            <br />
            <h5>
                <center>Por favor inicie sesion para comenzar</center>
                <footer>
                    <center>
                        Footer
                    </center>
                </footer>
            </h5>
            <br />
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                {props.children}
            </AuthenticatedTemplate>
        </>
    );
}
