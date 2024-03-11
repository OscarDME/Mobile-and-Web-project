import React, {useEffect, useState} from 'react'
//import ".../styles/WhiteBoard.css";
import { Chart } from 'primereact/chart';
import Dropdown from '../DropDown';

export default function Progress_Excercises() {

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

  return (
    <div className='MainContainer progress-exercise-container'>
          <Chart type="line" data={chartData} options={chartOptions} />
    </div>
  )
}
