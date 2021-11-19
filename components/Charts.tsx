import styles from '@/styles/modules/Charts.module.scss';
import { Line, Bar, Doughnut } from "react-chartjs-2";

export const ViewChart = ({ chartData }: any) => {
    const values = Object.values(chartData)
    const labels = Object.keys(chartData)

    const data = {
        labels: labels,
        datasets: [
            {
                data: values,
                fill: true,
                backgroundColor: '#104EAA10',
                borderColor: '#104EAA',
            }
        ],
        borderWidth: 1,
    }
    const options = {
        responsive: true,
        aspectRatio: 6/2,
        layout: {padding: 15},
        plugins: {
            title: {
              display: true,
              text: "Profile views for this month",
              color: "#0085FF",
            },
            legend: {display: false,},
        },
        scales: {
          y : {
              title: {display: true,text: "Views",color: "#0085FF"},
              ticks: {color: "#FFFFFF",},
              grid: {color: "#282E4290"},
          },
          x: {
              title: {display: true,text: "Dates",color: "#0085FF"
            },
              ticks: {color: "#FFFFFF"},
              grid: {color: "#282E4290"},
          }
    }}

    return (
        <div className={styles.viewchart}>
        <Line
          data={data}
          options={options}
        />
      </div>
    )
}

export const TransactionChart = ({ chartData }: any) => {
    const labels: any = Object.keys(chartData)
    const values: any = Object.values(chartData)

    const received = new Array
    const sent = new Array

    for(const i of values){
        received.push(i["received"])
        sent.push(i["sent"])
    }

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Received",
                backgroundColor: '#CC6B25',
                data: received,
            },
            {
                label: "Sent",
                data: sent,
                backgroundColor: '#0059DE',
            }
        ],
        borderWidth: 1,
    }
    const options = {
        responsive: true,
        aspectRatio: 6/2,
        layout: {padding: 15},
        plugins: {
            title: {display: true,text: "SOL transactions for this month",color: "#0085FF",},
        },
        scales: {
          y : {
              title: {display: true,text: "Amount of SOL",color: "#0085FF"
              },
              ticks: {color: "#FFFFFF",},
              grid: {color: "#282E4290"},
          },
          x: {
            title: {display: true,text: "Dates",color: "#0085FF"
            },
              ticks: {color: "#FFFFFF"},
              grid: {color: "#282E4290"
            },
          }
    }}

    return (
        <div className={styles.viewchart}>
        <Bar
          data={data}
          options={options}
        />
      </div>
    )
}

export const TransactionRatioChart = ({ chartData }: any) => {

    const data = {
        labels: ["Sent", "Received"],
        datasets: [
            {
                data: chartData,
                fill: true,
                hoverOffset: 5,
                backgroundColor: ['#CC6B25','#0059DE'],
                borderWidth: 1
            }
        ],
        borderWidth: 1,
    }
    const options = {
        responsive: true,
        aspectRatio: 5,
        layout: {padding: 10},
        plugins: {
            title: {display: true,text: "Sent vs Received proportion",color: "#0085FF",},
            legend: {display: false,},
        },
    }

    return (
        <div className={styles.viewchart}>
        <Doughnut
          data={data}
          options={options}
        />
      </div>
    )
}

