import { AuthenticatedTemplate } from "@azure/msal-react";
import "../styles/workarea.css";

export const Requests = () => {

    return (
        <>
        <div className="workarea">
            <AuthenticatedTemplate>
            </AuthenticatedTemplate>
        </div>
        </>
    )
}