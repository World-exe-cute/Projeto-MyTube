import "./ShowLineChart.css";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  Line,
} from "recharts";

export default function ShowLineChart({ data, wholeNum }) {
  const CustomTick = ({ x, y, payload, index }) => {
    let label = payload.value;

    if (index === 0 && label.length > 10) {
      label = label.substring(0, 10) + "...";
    }

    return (
      <text x={x} y={y + 10} textAnchor="middle" fill="#555" fontSize={12}>
        {label}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <div>{label}</div>
          <div>{payload[0].value}</div>
        </div>
      );
    }

    return null;
  };

  const formatTick = (value) => value.toFixed(1).replace(".", ",");

  return (
    <>
      {data?.length > 0 && (
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="0" vertical={false} />
            <XAxis
              dataKey="nome"
              interval={4}
              tick={CustomTick}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              domain={[0, 3]}
              allowDecimals={false}
              tickFormatter={wholeNum ? formatTick : ""}
              orientation="right"
            />
            <Tooltip content={CustomTooltip} />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#3498db"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
}
