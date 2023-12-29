import React from 'react';
import "../styles/App.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import {UserCard} from './UserCard';

export default function SideDataDisplay() {
  return (
    <>
      <div className='sidedatadisplay'>
        <h1 className='MainTitle'>Mis clientes</h1>
        <button className='addclient'>Añadir cliente</button>
        <div>
          // TODO: add user card that was selected on the list of clients and a button to delete that client
        </div>
        <input></input>
        <ul className='SideUsersList'>
          {UserCard.map((user, key) => {
            return (
              <li key={key} className='row' onClick={() => {/* add event here when clicked */}}>
                <div>{user.icon}</div>
                <div>
                  <div>{user.username}</div>
                  <div>{user.name}</div>
                  <div>{user.email}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

