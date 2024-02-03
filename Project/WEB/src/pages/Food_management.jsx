import { AuthenticatedTemplate } from "@azure/msal-react";
import React from 'react'

export const Food_management= () =>{
  return (
    <>
      <div className="workarea">
        <AuthenticatedTemplate>
          Diets_management
          </AuthenticatedTemplate>
      </div>
    </>
  )
}
