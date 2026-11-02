import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

type DataPoint = {
  date: string;
  brier: number;
};

export function BrierChart({ data }: { data: DataPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-inkSoft">
        Not enough data to plot a trend yet.
      </div>
    );
  }

  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: "var(--color-text-soft)", fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            tick={{ fill: "var(--color-text-soft)", fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
            domain={[0, 0.5]} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "var(--color-bg)", 
              border: "1px solid var(--color-line)",
              borderRadius: "12px",
              color: "var(--color-text)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }} 
            itemStyle={{ color: "var(--color-accent)" }}
          />
          <Line 
            type="monotone" 
            dataKey="brier" 
            stroke="var(--color-accent)" 
            strokeWidth={3} 
            dot={{ r: 4, fill: "var(--color-bg)", stroke: "var(--color-accent)", strokeWidth: 2 }} 
            activeDot={{ r: 6, fill: "var(--color-accent)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}