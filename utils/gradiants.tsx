export const TokenChartGradiants = (amount: number) => {
    return (
    [
        ["rgba(255, 85,187, 100)", "rgba(254, 31, 31, 100)"],
        ["rgba(0, 56, 255, 100)", "rgba(95, 178, 255, 100)"],
        ["rgba(8, 95, 0, 100)", "rgba(96, 255, 198, 100)"],
        ["rgba(255, 100, 0, 100)", "rgba(252, 255, 96, 100)"],
        ["rgba(255, 0, 0, 100)", "rgba(252, 125, 96, 100)"],
        ["rgba(4, 14, 252, 100)", "rgba(185, 96, 255, 100)"],
    ]
    .slice(0, amount)
    )
}