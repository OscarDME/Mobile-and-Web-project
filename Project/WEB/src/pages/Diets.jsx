import { AuthenticatedTemplate } from "@azure/msal-react";
import SideDataDisplay from "../components/SideDataDisplay";
import "../styles/workarea.css";

export const Diets = () => {

    return (
        <>
        <div className="workarea">
            <AuthenticatedTemplate>
                <SideDataDisplay/>
            </AuthenticatedTemplate>
        </div>
        </>
    )
}