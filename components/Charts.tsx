import { Line, Bar, Doughnut } from "react-chartjs-2"
import { TokenChartGradiants } from "@/utils/gradiants"

export const ViewChart = ({ chartData = { [1]: [1] } }: any) => {
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
                lineTension: .5,
                borderWidth: 1,
            }
        ],
    }
    const options = {
        maintainAspectRatio: false,
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

export const TransactionChart = ({ chartData = { 1: 1 } }: any) => {
    const labels: any = Object.keys(chartData)
    const values: any = Object.values(chartData)

    const received = new Array()
    const sent = new Array()

    for (const i of values) {
        received.push(i.received)
        sent.push(i.sent)
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
        maintainAspectRatio: false,
        layout: { padding: { top: 20, left: 5 } },
        scales: {
            y: {
                title: {
                    display: true, text: "Amount (SOL)", color: "#889FCD"
                },
                ticks: { color: "#FFFFFF", },
                grid: { color: "#282E4290" },
            },
            x: {
                title: {
                    display: true, text: "Dates", color: "#889FCD"
                },
                ticks: { color: "#FFFFFF" },
                grid: {
                    color: "#282E4290"
                },
            }
        }
    }
    return (
        <Bar data={data} options={options} />
    )
}

export const TransactionDistributionChart = ({ chartData }: any) => {

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
        maintainAspectRatio: false,
        layout: { padding: 20 },
        plugins: {
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

export const TokenDistributionChart = ({ chartData }: any) => {

    const data = (canvas: any ) => {
        const ctx = canvas.getContext("2d")
        const gradiants = TokenChartGradiants(Object.keys(chartData).length)
        const backgroundColors = new Array()
        for (const i of gradiants){
            let gradiant = ctx.createLinearGradient(0, 400, 0, 80);
            gradiant.addColorStop(1, i[0]);
            gradiant.addColorStop(0.6, i[1]);
            backgroundColors.push(gradiant)
        }
        console.log(Object.keys(chartData).map(t => chartData[t].symbol))
        return {    
        labels: Object.keys(chartData).map(t => chartData[t].symbol),
        datasets: [
            {
                data: Object.keys(chartData).map(t => chartData[t].usd),
                fill: true,
                backgroundColor: backgroundColors,
                borderWidth: 0
            }
        ],
    }
    }

    const options = {
        maintainAspectRatio: false,
        layout: { padding: 10 },
        plugins: {
            legend: {display: false,},
        },
        hoverOffset: 5
    }
    return (
        <Doughnut
            data={data}
            options={options}
        />
    )
}

