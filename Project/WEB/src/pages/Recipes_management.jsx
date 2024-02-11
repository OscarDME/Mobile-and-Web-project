import { AuthenticatedTemplate } from "@azure/msal-react";
import React from 'react'

export const Recipes_management = () =>{
  return (
    <>
      <div className="workarea">
        <AuthenticatedTemplate>
          Recipes_management
          </AuthenticatedTemplate>
      </div>
    </>
  )
}
