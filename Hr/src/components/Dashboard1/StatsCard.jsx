import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const statsData = [
  { title: "Total Employees", value: 856, change: "+10.0%", positive: true, label: "employees" },
  { title: "Job Views", value: 3342, change: "+22.0%", positive: true, label: "views" },
  { title: "Job Applied", value: 77, change: "+12.0%", positive: true, label: "applications" },
  { title: "Resigned Employees", value: 17, change: "-7.0%", positive: false, label: "resigned" },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <span
              className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${stat.positive ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
                }`}
            >
              {stat.positive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
              {stat.change}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">
            {stat.value.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1 capitalize">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}