//  const data = [
//     { month: "Jan", value: 80, color: "#FF6B6B" },
//     { month: "Feb", value: 200, color: "#FF8E53" },
//     { month: "Mar", value: 160, color: "#FFC560" },
//     { month: "Apr", value: 250, color: "#FFD75D" },
//     { month: "May", value: 150, color: "#A3E059" },
//     { month: "Jun", value: 100, color: "#8DD84F" },
//     { month: "Jul", value: 270, color: "#47D043" },
//     { month: "Aug", value: 170, color: "#5CD3A8" },
//     { month: "Sep", value: 150, color: "#52D5E0" },
//     { month: "Oct", value: 180, color: "#6BB9F0" },
//     { month: "Nov", value: 205, color: "#4EA3F7" },
//     { month: "Dec", value: 210, color: "#3A91E8" }
//   ];

// function EmployeesStatistics(){
//   const maxValue = Math.max(...data.map(item => item.value));
//   const containerHeight = 130;
 
//   return (
//     <div className="bg-white p-6 rounded-xl shadow-lg w-full">
//       <h2 className="text-lg font-semibold mb-6 text-blue-600">
//         Employee statistics of company
//       </h2>

//       <div className="flex items-end justify-between px-5 mx-auto" style={{ height: `${containerHeight}px` }}>
//         {data.map((item, index) => (
//           <div key={index} className="flex flex-col items-center gap-1">
            
//             {/* Bar */}
//             <p className='text-gray-600 text-sm'>{item.value}</p>
//             <div
//               className="w-10 rounded-md  hover:scale-101 shadow-2xl hover:shadow-gray-700 duration-700
//                cursor-pointer "
//               style={{
//                 height: `${(item.value / maxValue) * containerHeight}px`,
//                 backgroundColor: item.color
//               }}
//             ></div>

//             {/* Label */}
//             <span className="text-xs text-gray-600">{item.month}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };


// export default EmployeesStatistics

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", hires: 25, attrition: 10, growth: 15 },
  { month: "Feb", hires: 140, attrition: 20, growth: 120 },
  { month: "Mar", hires: 80, attrition: 40, growth: 40 },
  { month: "Apr", hires: 120, attrition: 30, growth: 90 },
  { month: "May", hires: 200, attrition: 50, growth: 150 },
  { month: "Jun", hires: 30, attrition: 70, growth: -40 },
  { month: "Jul", hires: 160, attrition: 40, growth: 120 },
  { month: "Aug", hires: 90, attrition: 60, growth: 30 },
  { month: "Sep", hires: 70, attrition: 50, growth: 20 },
  { month: "Oct", hires: 110, attrition: 40, growth: 70 },
  { month: "Nov", hires: 130, attrition: 25, growth: 105 },
  { month: "Dec", hires: 120, attrition: 15, growth: 105 }
];

export default function HiringStatsChart() {
  return (
    <div className="w-full h-[400px] bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-6 text-blue-600">
        Monthly Hiring & Attrition Analysis
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#E6E6E6" strokeDasharray="3 3" />

          <XAxis dataKey="month" stroke="#333" />
          <YAxis stroke="#333" />

          <Tooltip cursor={{ strokeDasharray: "3 3" }} />

          <Legend />

          <Line
            type="monotone"
            dataKey="hires"
            stroke="#2D8EFF"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="New Hires"
          />

          <Line
            type="monotone"
            dataKey="attrition"
            stroke="#FF7A45"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Attrition"
          />

          <Line
            type="monotone"
            dataKey="growth"
            stroke="#3AC16B"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Net Growth"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}