import { AuthenticatedTemplate } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { Container } from "react-bootstrap";
import RoutinesSideDisplay from "../components/RoutinesSideDisplay";

export const MyRoutines = () => {

    return (
        <>
            <AuthenticatedTemplate>
                <RoutinesSideDisplay/>
            </AuthenticatedTemplate>
        </>
    )
}