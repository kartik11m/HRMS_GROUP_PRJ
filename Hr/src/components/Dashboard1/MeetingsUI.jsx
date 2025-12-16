import React, { useState, useEffect } from "react";
import { Clock, Plus, MoreVertical, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function MeetingsUI() {
  const [meetings, setMeetings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "Remote"
  });

  const fetchMeetings = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/meetings");
      setMeetings(res.data);
    } catch (err) {
      console.error("Failed to fetch meetings", err);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete meeting?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/meetings/${id}`);
      fetchMeetings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Construct timestamps
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

      await axios.post("http://localhost:3000/api/meetings", {
        title: formData.title,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        type: formData.type
      });

      setShowModal(false);
      setFormData({ title: "", date: "", startTime: "", endTime: "", type: "Remote" });
      fetchMeetings();
    } catch (err) {
      console.error(err);
      alert("Failed to add meeting");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Helper to format date/time
  const getFormatters = (isoString) => {
    const dateObj = new Date(isoString);
    const dayShort = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const dateNum = dateObj.getDate();
    const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return { dayShort, dateNum, timeStr };
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm w-full h-full flex flex-col min-h-[350px] relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Upcoming Meetings</h2>
          <p className="text-sm text-gray-500">You have {meetings.length} meetings upcoming</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} />
          <span>Add</span>
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        {meetings.length === 0 && <p className="text-center text-gray-400 text-sm mt-10">No upcoming meetings</p>}
        {meetings.map((m, idx) => {
          const start = getFormatters(m.start_time);
          const end = getFormatters(m.end_time);

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="flex items-center gap-4 p-3 rounded-lg border border-gray-50 hover:bg-gray-50 transition-colors group"
            >
              {/* Date Box */}
              <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center text-blue-600 bg-blue-50 shrink-0 group-hover:bg-blue-100 transition-colors`}>
                <span className="text-[10px] font-bold uppercase tracking-wider">{start.dayShort}</span>
                <span className="text-lg font-bold leading-none">{start.dateNum}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-900 font-semibold text-sm truncate capitalize">{m.title}</h3>

                  {/* ALIGNMENT FIX: Flex container for badge and dots */}
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-50 text-orange-600 text-[10px] px-2 py-0.5 rounded-full font-medium">
                      {m.type}
                    </span>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition-colors" title="Delete"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <Clock size={12} />
                  <span className="truncate">From {start.timeStr} to {end.timeStr}</span>
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs font-medium text-blue-600 cursor-pointer hover:underline">View Calendar</span>
        <span className="text-xs text-gray-400">Synced now</span>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-gray-200 shadow-xl rounded-xl p-6 w-full max-w-sm relative z-10"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Add Meeting</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Title</label>
                  <input required name="title" value={formData.title} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Interview" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Date</label>
                    <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded-lg p-2 outline-none">
                      <option>Remote</option>
                      <option>In-Person</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Start</label>
                    <input required type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">End</label>
                    <input required type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded-lg p-2 outline-none" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-blue-700 mt-2">
                  Create Meeting
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}