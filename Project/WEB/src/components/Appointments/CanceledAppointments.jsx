import React, { useState, useEffect } from 'react';
import { APPOINTMENTS } from "../DATA_APPOINTMENTS";
import SearchBar from '../SearchBar';
import '../../styles/Management.css';
import config from "../../utils/conf";
import EditAppointment from './EditAppointment';


export default function CanceledAppointments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setselectedAppointment] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showEditPage, setShowEditPage] = useState(false);



  const filteredAppointments = APPOINTMENTS.filter(appointment =>
    appointment.assignedTo.toString().toLowerCase().includes(searchTerm.toLowerCase()) &&
    (appointment.status === 'Rechazada' || appointment.status === 'Cancelada')
); 


    const handleRowClick = (appointment) => {
      if (expandedRow === appointment.id) {
        setExpandedRow(null);
        setselectedAppointment(null);
      } else {
        setExpandedRow(appointment.id);
        setselectedAppointment(appointment);
      }
    };

    
    const handleEditClick = (appointment) => {
      setselectedAppointment(appointment);      
      setShowEditPage(true); 
    };

    const handleBackToList = () => {
        setShowEditPage(false); 
    };
    

    if (showEditPage) {
      return <EditAppointment onBackToList={handleBackToList} appointment={selectedAppointment} />;
  }

    return (
      <div className="container">
          <div className="search-bar-container">
            <div className='search-bar'>
              <div className='addclient'><i className="bi bi-search h4"></i></div>
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
          </div>
          <ul className='cardcontainer'>
            {filteredAppointments.map((appointment) => (
              <li key={appointment.id} className={`row ${((selectedAppointment && selectedAppointment.id === appointment.id)) ? 'selected' : ''}`}>
                <div onClick={() => handleRowClick(appointment)} className={`row_header ${((selectedAppointment && selectedAppointment.id === appointment.id)) ? 'selected' : ''}`}>
                  <div>
                    <div className='row_name'>Cliente: {appointment.assignedTo}</div>
                    <div className='row_description'>{appointment.status} para el {appointment.date}</div>
                  </div>
                  <div className="row_edit">
                      <i className={`bi bi-pencil-square  card-icon`} onClick={(e) => { e.stopPropagation(); handleEditClick(appointment); }}></i>
                    </div>
                </div>
                {expandedRow === appointment.id && (
                  <>
                    <div className="exercise-info">
                      <div className="exercise-info-column">
                      <div className="exercise-info-row">
                        Fecha de la cita: {appointment.date}
                      </div>
                      <div className="exercise-info-row">
                        Inicio de la cita: {appointment.startsAt}
                      </div>
                      <div className="exercise-info-row">
                        Fin de la cita: {appointment.endsAt}
                      </div>
                      </div>
                      <div className="exercise-info-column">
                      <div className="exercise-info-row">
                        <a href={appointment.place} target="_blank"> Lugar de la cita</a>
                      </div>
                      <div className="exercise-info-row">
                        Detalles extra: {appointment.details}
                      </div>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
      </div>
    );
}
