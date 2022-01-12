export const TokenChartGradiants = (amount: number) => {
    return (
        [
            ["#FF5454", "#FF5286"],
            ["#19B100", "#19B100"],
            ["#FF7A00", "#FFB800",],
            ["#1F93FF", "#2C67FF",],
            ["#FF6B00", "#FFC397",],
            ["#FF005C", "#FF005C",],
            ["#F79DFF", "#F79DFF"],
            ["#57D7FF", "#57D7FF"],

            ["#6D0000", "#FF5454"],
            ["#006D0B", "#19B100"],
            ["#FFB800", "#837600",],
            ["#2C67FF", "#0038FF",],
            ["#7B3B00", "#ffffff",],
            ["#6A0033", "#6A0033",],
            ["#68006A", "#68006A"],
            ["#00576A", "#00576A"],
        ]
            .slice(0, amount)
    )
}

export const GlowGradiant = [
    "#FF5454", //red
    "#19B100", // green 
    "#FFE600", // yellow
    "#1F93FF", // light blue
    "#FF6B00", // orange
    "#FF005C", // magenta
    "#F79DFF", // pink
    "#00FFC2", //cyan


    "#6D0000", // red2
    "#006D0B", // green2 
    "#837600", // yellow2
    "#0038FF", // light blue2
    "#7B3B00", // orange2
    "#6A0033", // magenta2
    "#68006A", // pink2
    "#00576A", //cyan2
]