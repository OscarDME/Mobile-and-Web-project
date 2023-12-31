import { AuthenticatedTemplate } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { Container } from "react-bootstrap";
import { IdTokenData } from "../components/DataDisplay";

export const Progress = () => {

    return (
        <>
            <AuthenticatedTemplate>
                <div>Pagina de progreso probando routing</div>
            </AuthenticatedTemplate>
        </>
    )
}