<<<<<<< HEAD
export const BarChart = ({ data, xKey, yKey }) => (
=======
export const BarChart = ({ data, xKey, yKey }: { data: any[], xKey: string, yKey: string }) => (
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  <div className="h-64 flex items-end justify-between">
    {data.map((item, index) => (
      <div key={index} className="w-8 bg-blue-500" style={{ height: `${item[yKey] / 10}%` }}>
        <div className="text-xs text-center">{item[xKey]}</div>
      </div>
    ))}
  </div>
)

<<<<<<< HEAD
export const LineChart = ({ data, xKey, yKey }) => (
=======
export const LineChart = ({ data, xKey, yKey }: { data: any[], xKey: string, yKey: string }) => (
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  <div className="h-64 flex items-end justify-between">
    {data.map((item, index) => (
      <div key={index} className="w-8 flex flex-col items-center">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <div className="h-full border-l border-blue-500"></div>
        <div className="text-xs">{item[xKey]}</div>
      </div>
    ))}
  </div>
)

<<<<<<< HEAD
export const PieChart = ({ data }) => (
=======
export const PieChart = ({ data }: { data: any[] }) => (
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  <div className="h-64 relative">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {data.map((item, index) => {
        const startAngle = index * (360 / data.length)
        const endAngle = (index + 1) * (360 / data.length)
        return (
          <path
            key={index}
            d={`M50 50 L${50 + 50 * Math.cos((startAngle * Math.PI) / 180)} ${50 + 50 * Math.sin((startAngle * Math.PI) / 180)} A50 50 0 0 1 ${50 + 50 * Math.cos((endAngle * Math.PI) / 180)} ${50 + 50 * Math.sin((endAngle * Math.PI) / 180)} Z`}
            fill={`hsl(${(index * 360) / data.length}, 70%, 50%)`}
          />
        )
      })}
    </svg>
  </div>
)
