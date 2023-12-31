import { AuthenticatedTemplate } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { Container } from "react-bootstrap";
import { IdTokenData } from "../components/DataDisplay";

export const Routines = () => {

    return (
        <>
            <AuthenticatedTemplate>
                <div>Pagina de rutinas probando routing</div>
            </AuthenticatedTemplate>
        </>
    )
}