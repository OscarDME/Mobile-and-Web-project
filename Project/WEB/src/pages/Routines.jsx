import { AuthenticatedTemplate } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { Container } from "react-bootstrap";
import SideDataDisplay from "../components/SideDataDisplay";

export const Routines = () => {

    return (
        <>
            <AuthenticatedTemplate>
                <SideDataDisplay/>
            </AuthenticatedTemplate>
        </>
    )
}