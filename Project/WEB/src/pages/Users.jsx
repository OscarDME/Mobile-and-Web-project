import { AuthenticatedTemplate } from "@azure/msal-react";
import "../styles/workarea.css";

export const Users = () => {

    return (
        <>
        <div className="workarea">
            <AuthenticatedTemplate>
            </AuthenticatedTemplate>
        </div>
        </>
    )
}