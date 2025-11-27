import React from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

const meetings = [
  {
    id: 1,
    dayShort: "Mon",
    date: 10,
    title: "Interview",
    time: "From 9:30 AM to 11:20 AM",
    color: "from-blue-300 to-blue-500",
  },
  {
    id: 2,
    dayShort: "Tue",
    date: 11,
    title: "Organizational Meeting",
    time: "From 9:30 AM to 11:20 AM",
    color: "from-purple-300 to-purple-500",
  },
  {
    id: 3,
    dayShort: "Wed",
    date: 12,
    title: "Meeting with the HR",
    time: "From 9:30 AM to 11:20 AM",
    color: "from-green-300 to-green-500",
  },
];

export default function MeetingsUI() {
  return (
    <div className="bg-white p-3.5 w-full max-w-[750px] h-[310px] rounded-xl overflow-hidden flex flex-col border border-[rgba(19,38,63,0.04)] shadow-[0_8px_20px_rgba(2,6,23,0.06)]">
      <div className="text-blue-600 font-bold mb-3 ml-1.5 text-lg">
        Meetings
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto">
        {meetings.map((m, idx) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * idx }}
            className="flex items-center gap-3 bg-gray-50 rounded-lg p-2.5 border border-gray-100 hover:shadow-sm transition-shadow"
          >
            <div className="shrink-0">
              <div
                className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center text-center text-white bg-linear-to-br ${m.color}`}
              >
                <span className="text-[10px] font-medium opacity-90">{m.dayShort}</span>
                <span className="text-base font-semibold leading-tight">{m.date}</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-gray-800 font-semibold text-sm truncate">{m.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <Clock size={12} />
                <span className="truncate">{m.time}</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="text-[10px] text-gray-500">Last synced 10m ago</div>
        <button className="text-xs font-medium px-3 py-1.5 rounded-md bg-linear-to-r from-indigo-500 to-indigo-600 text-white hover:brightness-95 transition">
          Sync
        </button>
      </div>
    </div>
  );
}