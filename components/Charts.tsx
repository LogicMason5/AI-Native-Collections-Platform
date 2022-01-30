import { Line, Bar, Doughnut, Chart } from "react-chartjs-2"
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
        layout: { padding: { top: 50, left: 5 } },
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

export const TransactionChart = ({ chartData = { 1: 1 }, type }: any) => {

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
                data: received,
                backgroundColor: '#008505',
                borderColor: '#008505',
                borderWidth: 1.5,
                lineTension: .5,
            },
            {
                label: "Sent",
                data: sent,
                backgroundColor: '#0059DE',
                borderColor: '#0059DE',
                borderWidth: 1.5,
                lineTension: .5,
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
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        let label = "";
                        if (context.parsed) {
                            label = context.dataset.label + "  " + context.formattedValue + " SOLs"
                        }
                        return label;
                    },
                }
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true
                    },
                    mode: "x",
                    speed: 50
                },
                pan: {
                    enabled: true,
                    mode: "xy",
                    speed: 50,
                }
            }
        },
    }
    return ( //@ts-ignore (interal type difference, not to worry about)
        (type == "line") ? <Line data={data} options={options} /> : <Bar data={data} options={options} />
    )
}

export const TransactionDistributionChart = ({ chartData }: any) => {

    const data = (canvas: any) => {
        const ctx = canvas.getContext("2d")

        let gradiant1 = ctx.createLinearGradient(0, 0, 0, 350);
        gradiant1.addColorStop(0.2, "#008505");
        gradiant1.addColorStop(1, "#00BE9C");

        let gradiant2 = ctx.createLinearGradient(0, 0, 0, 300);
        gradiant2.addColorStop(0.1, "#232E96");
        gradiant2.addColorStop(1, "#6CA3F4");
        return {
            labels: ["Received", "Sent"],
            datasets: [
                {
                    data: chartData,
                    fill: true,
                    backgroundColor: [gradiant1, gradiant2],
                    borderWidth: 0
                }
            ],
        }
    }

    const options = {
        maintainAspectRatio: false,
        aspectRatio: 1,
        layout: { padding: { top: 50, left: 30, right: 20, bottom: 25 } },
        plugins: {
            legend: { display: false, },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        let label = "";
                        if (context.parsed) {
                            label = context.label + "  " + context.parsed + "%"
                        }
                        return label;
                    },
                }
            }
        },
        hoverOffset: 5,
    }

    return (
        <Doughnut
            data={data}
            options={options}
        />
    )
}

export const TokenDistributionChart = ({ chartData, byAmount }: any) => {
    if (!byAmount) {
        //@ts-ignore
        chartData = Object.fromEntries(Object.entries(chartData).filter(([key, value]) => "value" in value))
    } else {
       const sort = (obj: any, valSelector: any) => {
         const sortedEntries = Object.entries(obj)
           .sort((a, b) =>
             valSelector(a[1]) > valSelector(b[1]) ? -1 :
               valSelector(a[1]) < valSelector(b[1]) ? 1 : 0);
         return new Map(sortedEntries);
       }
       //@ts-ignore
       var sortedMap = sort(chartData, val => val.amount);
       var sortedObj = {};
       //@ts-ignore
       sortedMap.forEach((v, k) => { sortedObj[k] = v }) 
       chartData = sortedObj
    }
    const data = (canvas: any) => {
        const ctx = canvas.getContext("2d")
        const gradiants = TokenChartGradiants(Object.keys(chartData).length)
        const backgroundColors = new Array()
        for (const i of gradiants) {
            let gradiant = ctx.createLinearGradient(0, 400, 0, 80);
            gradiant.addColorStop(1, i[0]);
            gradiant.addColorStop(0.6, i[1]);
            backgroundColors.push(gradiant)
        }
        return {
            labels: Object.keys(chartData).map(t => chartData[t].symbol),
            datasets: [
                {
                    data: Object.keys(chartData).map(t => byAmount ? chartData[t].amount : chartData[t].value),
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
            legend: { display: false, },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        let label = "";
                        if (context.parsed) {
                            label = context.label + "  $" + context.parsed
                            if(byAmount){
                                label = context.label + "  " + context.parsed
                            }

                        }
                        return label;
                    },
                }
            }
        },
        hoverOffset: 5,

    }
    return (
        <Doughnut
            data={data}
            options={options}
        />
    )
}

