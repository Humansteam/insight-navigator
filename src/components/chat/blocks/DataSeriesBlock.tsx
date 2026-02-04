import { AreaChart, Area, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingDown } from 'lucide-react';
import type { AssistantBlock, DataSeriesData } from '@/types/chat-blocks';

interface DataSeriesBlockProps {
  block: AssistantBlock & { dataSeries?: DataSeriesData };
}

export function DataSeriesBlock({ block }: DataSeriesBlockProps) {
  const { dataSeries, title } = block;
  
  if (!dataSeries) return null;
  
  // Transform data for Recharts
  const chartData = dataSeries.periods.map((period, i) => {
    const point: Record<string, string | number> = { period };
    dataSeries.groups?.forEach(group => {
      point[group.label] = group.data[i] ?? null;
    });
    return point;
  });
  
  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      {title && (
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
        </div>
      )}
      
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {dataSeries.groups?.map((group, i) => (
              <linearGradient key={group.label} id={`gradient-${group.label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors[i % colors.length]} stopOpacity={0.3} />
                <stop offset="100%" stopColor={colors[i % colors.length]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <XAxis 
            dataKey="period" 
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 'auto']}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          {dataSeries.threshold && (
            <ReferenceLine 
              y={dataSeries.threshold.value} 
              stroke="hsl(var(--destructive))" 
              strokeDasharray="4 4"
              label={{
                value: dataSeries.threshold.label,
                position: 'right',
                fontSize: 10,
                fill: 'hsl(var(--destructive))',
              }}
            />
          )}
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          {dataSeries.groups?.map((group, i) => (
            <Area
              key={group.label}
              type="monotone"
              dataKey={group.label}
              stroke={colors[i % colors.length]}
              fill={`url(#gradient-${group.label})`}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Legend + Source */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          {dataSeries.groups?.map((group, i) => (
            <span key={group.label} className="flex items-center gap-1.5">
              <span 
                className="w-3 h-1 rounded" 
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              {group.label}
            </span>
          ))}
          {dataSeries.threshold && (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-destructive rounded" style={{ borderStyle: 'dashed' }} />
              {dataSeries.threshold.label}
            </span>
          )}
        </div>
        {dataSeries.source && (
          <span className="text-muted-foreground/70">
            Источник: {dataSeries.source.document} стр. {dataSeries.source.page}
          </span>
        )}
      </div>
    </div>
  );
}
