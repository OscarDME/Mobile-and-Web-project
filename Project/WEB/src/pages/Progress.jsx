import { AuthenticatedTemplate } from "@azure/msal-react";
import SideDataDisplay from "../components/SideDataDisplay";
import "../styles/workarea.css";
import UsersProgress from "../components/Progress/UsersProgress";

export const Progress = () => {

    return (
        <>
        <div className="workarea">
            <AuthenticatedTemplate>
                <SideDataDisplay/>
                <UsersProgress/>
            </AuthenticatedTemplate>
        </div>
        </>
    )
}