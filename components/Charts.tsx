import { Line, Bar, Doughnut } from "react-chartjs-2"


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
                borderColor: '#5196FD',
                tension: .5,
                borderWidth: 1,
            }
        ],
    }
    const options = {
        responsive: true,
        aspectRatio: 5 / 2,
        layout: { padding: 15 },
        plugins: {
            legend: { display: false, },
        },
        scales: {
            y: {
                title: { display: true, text: "Views", color: "#889FCD" },
                ticks: { color: "#FFFFFF", },
                grid: { color: "#282E4290" },
            },
            x: {
                title: {
                    display: true, text: "Dates", color: "#889FCD"
                },
                ticks: { color: "#FFFFFF" },
                grid: { color: "#282E4290" },
            }
        }
    }

    return (
        <Line
            data={data}
            options={options}
        />
    )
}

export const TransactionChart = ({ chartData }: any) => {
    const labels: any = Object.keys(chartData)
    const values: any = Object.values(chartData)

    const received = new Array
    const sent = new Array

    for (const i of values) {
        received.push(i["received"])
        sent.push(i["sent"])
    }

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Received",
                backgroundColor: '#0059DE',
                data: received,
            },
            {
                label: "Sent",
                data: sent,
                backgroundColor: '#FFFFFF',
            }
        ],
        borderWidth: 1,
    }
    const options = {
        responsive: true,
        aspectRatio: 6 / 2,
        layout: { padding: 15 },
        plugins: {
            title: { display: true, text: "SOL transactions for this month", color: "#0085FF", },
        },
        scales: {
            y: {
                title: {
                    display: true, text: "Amount of SOL", color: "#0085FF"
                },
                ticks: { color: "#FFFFFF", },
                grid: { color: "#282E4290" },
            },
            x: {
                title: {
                    display: true, text: "Dates", color: "#0085FF"
                },
                ticks: { color: "#FFFFFF" },
                grid: {
                    color: "#282E4290"
                },
            }
        }
    }

    return (
        <Bar
            data={data}
            options={options}
        />
    )
}

export const DistributionChart = ({ chartData }: any) => {

    const data = {
        labels: ["Sent", "Received"],
        datasets: [
            {
                data: chartData,
                fill: true,
                backgroundColor: ['#FFFFFF', '#0059DE'],
                borderWidth: 1
            }
        ],
        borderWidth: 1,
    }
    const options = {
        responsive: true,
        aspectRatio: 1,
        plugins: {
            title: { display: true, text: "Distribution", color: "#0085FF", },
            legend: { display: false, },
        },
    }

    return (
        <Doughnut
            data={data}
            options={options}
        />
    )
}

