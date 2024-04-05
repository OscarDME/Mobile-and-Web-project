import React, {useEffect, useState} from 'react'
//import ".../styles/WhiteBoard.css";
import { Chart } from 'primereact/chart';
import Dropdown from '../DropdownCollections';
import config from "../../utils/conf";
import { useMsal } from "@azure/msal-react";

export default function Progress_Excercises() {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  console.log(activeAccount.idTokenClaims.oid);

  const [chartData, setChartData] = useState({});
  useEffect(() => {
    // Inicialización con datasets vacíos
    setChartData({
      labels: [],
      datasets: [
        {
          label: 'Peso levantado',
          borderColor: 'rgba(255, 99, 132, 1)', // Usa el color que prefieras
          data: []
        },
        {
          label: '1RM',
          borderColor: 'rgba(54, 162, 235, 1)', // Usa el color que prefieras
          data: []
        },
        {
          label: 'Predicción1RM',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderDash: [5, 5],
          data: [],
        },
      ]
    });
  }, []);
  const [chartOptions, setChartOptions] = useState({});
  const [ejercicios, setEjercicios] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseLoads, setExerciseLoads] = useState([]);
  const [rmPredictions, setRmPredictions] = useState([]);
  const [rms, setRms] = useState([]);

  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/ejercicio`);
        const data = await response.json();
        // Transformar datos si es necesario para que coincidan con lo esperado por SelectList
        const ejerciciosTransformados = data.map((ejercicio) => ({
          value: ejercicio.ID_Ejercicio.toString(),
          label: ejercicio.ejercicio,
          type: ejercicio.Modalidad,
        }));
        setEjercicios(ejerciciosTransformados);
      } catch (error) {
        console.error("Error al obtener los ejercicios:", error);
      }
    };

    fetchEjercicios();
  }, []);

  
  useEffect(() => {
    if (selectedExercise) {
      const ID_Usuario = activeAccount.idTokenClaims.oid; // Asume que esto obtiene el ID del usuario
      const ID_Ejercicio = selectedExercise.value;
      const escala = 'seisMeses'; // Hardcodeado para siempre usar seis meses

      const fetchExerciseLoads = async () => {
        try {
          const url = `${config.apiBaseUrl}/Weights/${ID_Usuario}/${ID_Ejercicio}/${escala}`;
          const response = await fetch(url);
          const data = await response.json();

          // Transforma y actualiza los datos para el gráfico
          const updatedChartData = { ...chartData }; // Copia el estado actual de chartData
          updatedChartData.labels = data.map(entry => entry.fecha);
          updatedChartData.datasets[0].data = data.map(entry => entry.PesoMaximo); // Asume el primer dataset es 'Peso levantado'
          setChartData(updatedChartData);
        } catch (error) {
          console.error("Error al obtener los pesos máximos:", error);
        }
      };

      fetchExerciseLoads();
    }
  }, [selectedExercise]);

  useEffect(() => {
    if (selectedExercise) {
      const ID_Usuario = activeAccount.idTokenClaims.oid;
      const ID_Ejercicio = selectedExercise.value;
  
      const fetchHistoricalRMData = async () => {
        const url = `${config.apiBaseUrl}/HistoricalRM/${ID_Usuario}/${ID_Ejercicio}`;
  
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Failed to fetch historical RM data');
          }
          const rmData = await response.json();
  
          // Continuamos con la lógica de cálculo como la tenías
          let L = rmData[0]?.Max1RM ?? 0;
          let T = (rmData[1]?.Max1RM - L) ?? 0;
          const alpha = 0.9;
          const beta = 0.6;
  
          // Suponiendo que el array rmData está ordenado por fecha
          rmData.forEach((dataPoint, index) => {
            if (index > 0) {
              const actual = dataPoint.Max1RM;
              let Lt = L;
              L = alpha * actual + (1 - alpha) * (Lt + T);
              T = beta * (L - Lt) + (1 - beta) * T;
            }
          });
  
          // Generar las predicciones para los próximos 3 meses, empezando desde el mes siguiente al último registro
          const lastRMDate = new Date(rmData[rmData.length - 1].fecha);
          lastRMDate.setMonth(lastRMDate.getMonth() + 1); // Mueve al mes siguiente
  
          // Ajusta el primer punto de las predicciones un mes después del último registro
          lastRMDate.setMonth(lastRMDate.getMonth() + 1);
  
          const predictions = [];
          for (let i = 0; i < 3; i++) {
            predictions.push(L + T * (i + 1));
          }
  
          // Generar las etiquetas (fechas) para las predicciones
          const predictionLabels = [];
          for (let i = 0; i < 3; i++) {
            const newDate = new Date(lastRMDate);
            newDate.setMonth(newDate.getMonth() + i);
            predictionLabels.push(`${newDate.getFullYear()}-${('0' + (newDate.getMonth() + 1)).slice(-2)}`);
          }
  
          // Actualiza el gráfico con las predicciones
          setChartData(prevChartData => ({
            ...prevChartData,
            labels: [...prevChartData.labels, ...predictionLabels],
            datasets: prevChartData.datasets.map((dataset, index) => {
              if (index === 2) { 
                return {
                  ...dataset,
                  data: [...dataset.data, ...predictions],
                };
              }
              return dataset;
            }),
          }));
        } catch (error) {
          console.error("Error fetching historical RM data:", error);
        }
      };
  
      fetchHistoricalRMData();
    }
  }, [selectedExercise]);
  

  
//   useEffect(() => {
//     const documentStyle = getComputedStyle(document.documentElement);
//     const textColor = documentStyle.getPropertyValue('--text');
//     const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
//     const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
//     const data = {
//         labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July',],
//         datasets: [
//             {
//                 label: 'Peso levantado',
//                 fill: false,
//                 borderColor: documentStyle.getPropertyValue('--accent'),
//                 yAxisID: 'y',
//                 tension: 0.4,
//                 data: [65, 59,null,null, 56, 55, 10]
//             },
//             {
//               label: '1RM',
//               fill: false,
//               borderColor: documentStyle.getPropertyValue('--primary'),
//               yAxisID: 'y',
//               tension: 0.4,
//               data: [65, 5, 8, 81, 56, 55, 10]
//           },
//           {
//             label: 'Predicción 1RM',
//             fill: false,
//             borderDash: [5, 5],
//             borderColor: documentStyle.getPropertyValue('--primary'),
//             yAxisID: 'y',
//             tension: 0.4,
//             data: [65, 55, 10,10,15,123,53]
//         }
//         ]
//     };
//     const options = {
//         stacked: false,
//         maintainAspectRatio: false,
//         aspectRatio: 0.6,
//         plugins: {
//             legend: {
//                 labels: {
//                     color: textColor
//                 }
//             }
//         },
//         scales: {
//             x: {
//                 ticks: {
//                     color: textColorSecondary
//                 },
//                 grid: {
//                     color: surfaceBorder
//                 }
//             },
//             y: {
//                 type: 'linear',
//                 display: true,
//                 position: 'left',
//                 ticks: {
//                     color: textColorSecondary
//                 },
//                 grid: {
//                     color: surfaceBorder
//                 }
//             }
//         }
//     };

//     setChartData(data);
//     setChartOptions(options);
// }, []);

const exercisesOptions = [
    { label: "Cuello", value: 1 },
    { label: "Bicep", value: 2 },
    { label: "Cintura", value: 3 },
    { label: "Cadera", value: 4 },
    { label: "Pecho", value: 5 },
    { label: "Muslo", value: 6 },
  ];

  const handleExerciseToShowChange = (selectedOption) => {
    setSelectedExercise(selectedOption ?? null);
    console.log(selectedOption);
  };

  return (
    <div className='MainContainer progress-exercise-container'>
          <div className='body-dropdown-container'>
      <div>
      Selecciona un ejercicio para ver la gráfica
      </div>
      <Dropdown 
            options={ejercicios} 
            selectedOption={selectedExercise} 
            onChange={handleExerciseToShowChange}
          />
      </div>
          <Chart type="line" data={chartData} options={chartOptions} />
    </div>
  )
}
