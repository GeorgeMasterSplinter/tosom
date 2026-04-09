import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function RadarChart({ breakdown }) {
  const data = {
    labels: ["Base", "Deep", "Resonans", "Semantikk"],
    datasets: [
      {
        label: "Matchscore",
        data: [
          breakdown.base,
          breakdown.deep,
          breakdown.resonance,
          breakdown.semantic,
        ],
        backgroundColor: "rgba(59, 130, 246, 0.3)", // blå, transparent
        borderColor: "rgba(59, 130, 246, 1)",       // blå kant
        borderWidth: 2,
        pointBackgroundColor: "white",
        pointBorderColor: "rgba(59, 130, 246, 1)",
        pointRadius: 4,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: "#333" },
        grid: { color: "#444" },
        pointLabels: { color: "#ccc", font: { size: 14 } },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
      <h3 className="text-lg font-semibold mb-3">Matchprofil</h3>
      <Radar data={data} options={options} />
    </div>
  );
}
