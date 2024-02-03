import { AuthenticatedTemplate } from "@azure/msal-react";
import React, { useState, useEffect } from 'react';
import Exercises_management_list from '../components/Exercises_management/Exercises_management_list';
import Exercises_management_add from '../components/Exercises_management/Exercises_management_add';

export const Exercises_management = () => {  
  return (
    <div className="container">
      <AuthenticatedTemplate>
      <Exercises_management_list/>
      </AuthenticatedTemplate>
    </div>
  );
};
