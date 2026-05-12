import {
  Line,
  Bar,
  Doughnut,
} from "react-chartjs-2";

import {
  ChartData,
  ChartOptions,
} from "chart.js";

import { useMemo } from "react";

import { TokenChartGradiants } from "@/utils/gradiants";


// ======================================================
// Shared Types
// ======================================================

type ViewChartProps = {
  chartData?: Record<string, number>;
};

type TransactionValue = {
  received: number;
  sent: number;
};

type TransactionChartProps = {
  chartData?: Record<string, TransactionValue>;
  type?: "line" | "bar";
};

type TokenData = {
  symbol: string;
  value?: number;
  amount?: number;
};

type TokenDistributionChartProps = {
  chartData: Record<string, TokenData>;
  byAmount?: boolean;
};


// ======================================================
// Shared Chart Options
// ======================================================

const axisStyles = {
  ticks: {
    color: "#FFFFFF",
  },
  grid: {
    color: "#282E4290",
  },
};

const createBaseOptions = (
  yTitle: string,
  xTitle = "Dates"
): ChartOptions<any> => ({
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
    },
  },

  scales: {
    y: {
      ...axisStyles,
      title: {
        display: true,
        text: yTitle,
        color: "#889FCD",
      },
    },

    x: {
      ...axisStyles,
      title: {
        display: true,
        text: xTitle,
        color: "#889FCD",
      },
    },
  },
});


// ======================================================
// View Chart
// ======================================================

export const ViewChart = ({
  chartData = {},
}: ViewChartProps) => {

  const data = useMemo<ChartData<"line">>(() => ({
    labels: Object.keys(chartData),

    datasets: [
      {
        data: Object.values(chartData),
        fill: true,
        backgroundColor: "#104EAA10",
        borderColor: "#5196FD",
        tension: 0.5,
        borderWidth: 1,
      },
    ],
  }), [chartData]);

  const options = useMemo(
    () => createBaseOptions("Views"),
    []
  );

  return (
    <Line
      data={data}
      options={options}
    />
  );
};


// ======================================================
// Transaction Chart
// ======================================================

export const TransactionChart = ({
  chartData = {},
  type = "line",
}: TransactionChartProps) => {

  const labels = useMemo(
    () => Object.keys(chartData),
    [chartData]
  );

  const { received, sent } = useMemo(() => ({
    received: Object.values(chartData).map(v => v.received),
    sent: Object.values(chartData).map(v => v.sent),
  }), [chartData]);

  const data = useMemo<ChartData<"line" | "bar">>(() => ({
    labels,

    datasets: [
      {
        label: "Received",
        data: received,
        backgroundColor: "#008505",
        borderColor: "#008505",
        borderWidth: 1.5,
        tension: 0.5,
      },

      {
        label: "Sent",
        data: sent,
        backgroundColor: "#0059DE",
        borderColor: "#0059DE",
        borderWidth: 1.5,
        tension: 0.5,
      },
    ],
  }), [labels, received, sent]);

  const options = useMemo<ChartOptions<any>>(() => ({
    ...createBaseOptions("Amount (SOL)"),

    plugins: {
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label} ${context.formattedValue} SOL`,
        },
      },

      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },

          mode: "x",
        },

        pan: {
          enabled: true,
          mode: "xy",
        },
      },
    },
  }), []);

  return type === "line" ? (
    <Line data={data} options={options} />
  ) : (
    <Bar data={data} options={options} />
  );
};


// ======================================================
// Transaction Distribution Chart
// ======================================================

export const TransactionDistributionChart = ({
  chartData,
}: {
  chartData: number[];
}) => {

  const data = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");

    if (!ctx) return { datasets: [] };

    const gradient1 = ctx.createLinearGradient(0, 0, 0, 350);
    gradient1.addColorStop(0.2, "#008505");
    gradient1.addColorStop(1, "#00BE9C");

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 300);
    gradient2.addColorStop(0.1, "#232E96");
    gradient2.addColorStop(1, "#6CA3F4");

    return {
      labels: ["Received", "Sent"],

      datasets: [
        {
          data: chartData,
          backgroundColor: [gradient1, gradient2],
          borderWidth: 0,
        },
      ],
    };
  };

  return (
    <Doughnut
      data={data}
      options={{
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
};


// ======================================================
// Token Distribution Chart
// ======================================================

export const TokenDistributionChart = ({
  chartData,
  byAmount = false,
}: TokenDistributionChartProps) => {

  const filteredData = useMemo(() => {

    const entries = Object.entries(chartData);

    const valid = byAmount
      ? entries
      : entries.filter(
          ([_, value]) => value.value !== undefined
        );

    return valid.sort((a, b) => {
      const aVal = byAmount
        ? a[1].amount ?? 0
        : a[1].value ?? 0;

      const bVal = byAmount
        ? b[1].amount ?? 0
        : b[1].value ?? 0;

      return bVal - aVal;
    });

  }, [chartData, byAmount]);

  const data = (canvas: HTMLCanvasElement) => {

    const ctx = canvas.getContext("2d");

    if (!ctx) return { datasets: [] };

    const gradients = TokenChartGradiants(filteredData.length);

    const backgroundColors = gradients.map(colors => {
      const gradient = ctx.createLinearGradient(
        0,
        400,
        0,
        80
      );

      gradient.addColorStop(1, colors[0]);
      gradient.addColorStop(0.6, colors[1]);

      return gradient;
    });

    return {
      labels: filteredData.map(([_, value]) => value.symbol),

      datasets: [
        {
          data: filteredData.map(([_, value]) =>
            byAmount
              ? value.amount ?? 0
              : value.value ?? 0
          ),

          backgroundColor: backgroundColors,
          borderWidth: 0,
        },
      ],
    };
  };

  return (
    <Doughnut
      data={data}
      options={{
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
};
