import React, {useEffect, useState} from 'react'
import { Chart } from 'primereact/chart';
import Progress_Body_MeasuresAdd from './Progress_Body_MeasuresAdd';
import Dropdown from '../DropdownCollections';
import Progress_Body_MeasuresEdit from './Progress_Body_MeasuresEdit';
import { milestones } from '../DATA_MILESTONES';



export default function Progress_Body_Measures({selectedUser}) {

  const [expandedRow, setExpandedRow] = useState(null);
  const [showAddPage, setShowAddPage] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);
  const [eliminatingMilestone, setEliminatingMilestone] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedMeasureToShow, setSelectedMeasureToShow] = useState(null);


  //datos de la grafica


  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
      const data = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July',],
          datasets: [
              {
                  label: 'Peso levantado',
                  fill: false,
                  borderColor: documentStyle.getPropertyValue('--accent'),
                  yAxisID: 'y',
                  tension: 0.4,
                  data: [65, 59,null,null, 56, 55, 10]
              },
              {
                label: '1RM',
                fill: false,
                borderColor: documentStyle.getPropertyValue('--primary'),
                yAxisID: 'y',
                tension: 0.4,
                data: [65, 5, 8, 81, 56, 55, 10]
            },
            {
              label: 'Predicción 1RM',
              fill: false,
              borderDash: [5, 5],
              borderColor: documentStyle.getPropertyValue('--primary'),
              yAxisID: 'y',
              tension: 0.4,
              data: [65, 55, 10,10,15,123,53]
          }
          ]
      };
      const options = {
          stacked: false,
          maintainAspectRatio: false,
          aspectRatio: 0.6,
          plugins: {
              legend: {
                  labels: {
                      color: textColor
                  }
              }
          },
          scales: {
              x: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder
                  }
              },
              y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder
                  }
              }
          }
      };

      setChartData(data);
      setChartOptions(options);
  }, []);
  
  const handleRowClick = (milestone) => {

    if (expandedRow === milestone.id) {
      setExpandedRow(null);
      setEliminatingMilestone(null);
      setSelectedMilestone(null);
    } else {
      if (eliminatingMilestone && eliminatingMilestone !== milestone.id) {
      setEliminatingMilestone(null);
      setExpandedRow(null); 
      setSelectedMilestone(null);
      }
      setEliminatingMilestone(null);
      setExpandedRow(milestone.id);
      setSelectedMilestone(milestone); 
    }
  };

  const handleDeleteClick = (milestone) => {

    if (eliminatingMilestone && eliminatingMilestone.id === milestone.id) {
      setExpandedRow(null);
      setEliminatingMilestone(null);
      setSelectedMilestone(null);
    } else {
      if (expandedRow && expandedRow !== milestone.id) {
      setEliminatingMilestone(null);
      setExpandedRow(null); 
      setSelectedMilestone(null);
      }
      setExpandedRow(null);
      setSelectedMilestone(milestone); 
      setEliminatingMilestone(milestone);
    }
  };
  
  const handleAddClick = () => {
    setShowEditPage(false); 
    setShowAddPage(true); 
  };

  const handleEditClick = (milestone) => {
    setSelectedMilestone(milestone);
    setShowAddPage(false); 
    setShowEditPage(true); 
  };

  const handleBackToList = () => {
    setShowEditPage(false);
    setShowAddPage(false);
  };

  const handleDeleteMilestone = (milestone) => {

  }
  

  if (showAddPage) {
    return <Progress_Body_MeasuresAdd onBackToList={handleBackToList} selectedUser={selectedUser}/>;
  }

  if (showEditPage) {
    return <Progress_Body_MeasuresEdit onBackToList={handleBackToList} selectedUser={selectedUser} selectedMilestone={selectedMilestone}/>;
  }
  
  const measureOptions = [
    { label: "Cuello", value: 1 },
    { label: "Bicep", value: 2 },
    { label: "Cintura", value: 3 },
    { label: "Cadera", value: 4 },
    { label: "Pecho", value: 5 },
    { label: "Muslo", value: 6 },
  ];

  const handleMeasureToShowChange = (selectedOption) => {
    setSelectedMeasureToShow(selectedOption ?? null);
    console.log(selectedOption);
  };

  return (
    <>
      <div className='MainContainer'>
      <div className='body-measure-container'>
      <Dropdown 
            options={measureOptions} 
            selectedOption={selectedMeasureToShow} 
            onChange={handleMeasureToShowChange}
          />
      <Chart type="line" data={chartData} options={chartOptions} />
      </div>
      <div className='body-measure-container'>
      <div className="measures-list-container">
      <div className="measures-list-header">
            <h2 className=''>
            Lista de Hitos
            </h2>
            <div>
              <a className="iconadd" role="button" onClick={handleAddClick}><i className="bi bi-plus-circle-fill"></i></a>
            </div>
            </div>
            <ul className='cardcontainer cardcontainer2'>
            {milestones.map((milestone, milestoneIndex) => (
                <li className={`row ${((selectedMilestone && selectedMilestone.id === milestone.id)) ? 'selected' : ''}`} key={milestoneIndex} onClick={() => handleRowClick(milestone)}>
                  <div onClick={() => handleRowClick(milestone)} className={`row_header ${((selectedMilestone && selectedMilestone.id === milestone.id)) ? 'selected' : ''}`}>
                    <div>
                    <div className='row_description'>Fecha de creación:</div>
                      <div className='row_name'>{milestone.date}</div>
                    </div>
                    <div className="row_buttons">
                      <div className="row_edit">
                          <i className={`bi bi-trash card-icon`} onClick={(e) => { setSelectedMilestone(milestone); e.stopPropagation(); handleDeleteClick(milestone); }}></i>
                      </div>
                      <div className="row_edit">
                        <i className={`bi bi-pencil-square card-icon`} onClick={(e) => { e.stopPropagation(); handleEditClick(milestone); }}></i>
                      </div>
                  </div>
                  </div>
                  {expandedRow === milestone.id && (
                  <>
                    <div className="exercise-info">
                      <div className="exercise-info-column">
                      <div className="exercise-info-row"><h5>Datos biométricos</h5></div>
                        <div className="exercise-info-row">Peso: {milestone.weight}</div>
                        <div className="exercise-info-row">IMC: {milestone.IMC}</div>
                        <div className="exercise-info-row">Masa muscular neta: {milestone.netMuscleMass}</div>
                        <div className="exercise-info-row">% de grasa: {milestone.fatPercent}</div>
                      <div className="exercise-info-row">Ritmo cardiaco en reposo: {milestone.cardiacRithm}</div>
                      <div className="exercise-info-row">Presión arterial: {milestone.bloodPressure}</div>
                      </div>
                      <div className="exercise-info-column">
                      <div className="exercise-info-row"><h5>Medidas corporales</h5></div>
                        <div className="exercise-info-row">Cuello: {milestone.neck} cm</div>
                        <div className="exercise-info-row">Pecho: {milestone.chest} cm</div>
                        <div className="exercise-info-row">Cintura: {milestone.waist} cm</div>
                        <div className="exercise-info-row">Cadera: {milestone.hip} cm</div>
                      <div className="exercise-info-row">Hombros: {milestone.shoulders} cm</div>
                      <div className="exercise-info-row">Bicep: {milestone.biceps} cm</div>
                      <div className="exercise-info-row">Antebrazos: {milestone.forearms} cm</div>
                      <div className="exercise-info-row">Muslos: {milestone.cuads} cm</div>
                      <div className="exercise-info-row">Pantorrilla: {milestone.calf} cm</div>
                      </div>

                    </div>
                  </>
                )}
                {eliminatingMilestone && eliminatingMilestone.id === milestone.id && (
                  <>
                  <div className="exercise-info">
                  <button className='delete_button' onClick={(e) => { e.stopPropagation(); handleDeleteMilestone()}}>Eliminar hito</button>
                  </div>
                  </>
                )}
  </li>
))}
</ul>
      </div>
      </div>
      </div>
    </>
  )
}


