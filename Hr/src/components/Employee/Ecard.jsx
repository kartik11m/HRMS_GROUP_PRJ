<<<<<<< HEAD
import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

const Ecard = ({ employees }) => {
  const navigate = useNavigate();

  return (
    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-center gap-11 sm:p-6 p-1">
      {employees.map((emp) => (
        <div key={emp.id} className="rounded-2xl shadow-md border border-gray-200 p-3 space-y-4 bg-white relative">
          <div className="flex flex-row justify-between px-2">
            <div className="flex gap-2 items-center">
              <span className={`h-2.5 w-2.5 rounded-full ${emp.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              <p className={`my-auto rounded-2xl p-0.5 px-2 font-semibold text-[11px] 
                    ${emp.status === 'online' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
              >
                {emp.status || 'OFFLINE'}
              </p>
            </div>
            <p className="font-bold cursor-pointer text-gray-400">⋮</p>
          </div>

          <div className="flex gap-5 px-1.5 items-center">
            {emp.avatar ? (
              <img
                src={emp.avatar}
                alt={emp.name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = "/flower1.png"; }}
              />
            ) : (
              <img src="/flower1.png" alt={emp.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
            )}
            <div>
              <p className="font-bold text-gray-800">{emp.name}</p>
              <p className="text-gray-600 text-sm">{emp.designation || 'Employee'}</p>
            </div>
          </div>

          <div className="flex justify-between px-1.5">
            <div>
              <p className="text-gray-400 text-[11px] font-semibold uppercase">DEPARTMENT</p>
              <p className="text-gray-800 text-sm">{emp.department || '-'}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-[11px] font-semibold uppercase">PHONE</p>
              <p className="text-gray-700 text-sm">{emp.phone || '-'}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-50 p-2 gap-0.5 text-gray-600 text-sm truncate">
            <div className="flex items-center gap-2">
              <Mail size={12} />
              <a href={`mailto:${emp.email}`} className="truncate block" title={emp.email}>{emp.email}</a>
            </div>
          </div>

          {emp.skills && emp.skills.length > 0 && (
            <div className="px-1.5 flex flex-wrap gap-1">
              {emp.skills.slice(0, 3).map((skill, i) => (
                <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                  {skill}
                </span>
              ))}
              {emp.skills.length > 3 && (
                <span className="text-[10px] text-gray-400">+{emp.skills.length - 3}</span>
              )}
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => navigate('/chat')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full py-1.5 text-sm font-medium transition"
            >
=======
import React, { useEffect, useState } from "react";
import { Mail, Phone, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Ecard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUsers([]);
          setLoading(false);
          return;
        }
        const res = await fetch("http://localhost:3000/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
        if (!res.ok) {
          let errBody = null;
          try { errBody = await res.json(); } catch {}
          if (res.status === 401) {
            if (errBody && errBody.message === "Token expired") {
              alert("Session expired. Please log in again.");
            }
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
            return;
          }
          setUsers([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setUsers(data.users || data);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (d) => {
    if (!d) return "N/A";
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return String(d).slice(0, 10);
    }
  };

  const defaultAvatar = "/pexels-olly-927022.jpg";

  if (loading) return <p>Loading employees...</p>;

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
      {users.map((u) => (
        <div key={u.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-5 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${u.status === "ACTIVE" ? "bg-green-50 text-green-700" : u.status === "DEACTIVE" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}>
              {u.status || "ACTIVE"}
            </span>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={16} />
            </button>
          </div>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border border-gray-100">
              <img src={u.profile_picture ? (u.profile_picture.startsWith('http') ? u.profile_picture : `http://localhost:3000${u.profile_picture}`) : defaultAvatar} alt={u.fullname} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">{u.fullname}</h3>
            <p className="text-sm text-gray-500 font-medium">{u.job_title || u.designation || "-"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 border-t border-b border-gray-50 py-4">
            <div className="text-center border-r border-gray-50">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Department</p>
              <p className="text-sm font-semibold text-gray-800">{u.department || "-"}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Joined</p>
              <p className="text-sm font-semibold text-gray-800">{formatDate(u.date_of_joining || u.created_at)}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6 flex-1">
            <a href={`mailto:${u.email}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-50">
              <Mail size={16} className="text-gray-400" />
              <span className="truncate">{u.email}</span>
            </a>
            <a href={`tel:${u.phone || ""}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-50">
              <Phone size={16} className="text-gray-400" />
              <span className="truncate">{u.phone || "-"}</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-auto">
            <button onClick={() => navigate(`/profile/${u.id}`)} className="w-full py-2 px-4 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
              View Profile
            </button>
            <button onClick={() => navigate(`/chat?userId=${u.id}`)} className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm">
>>>>>>> af8e894881da2d14929bcae57d583ad190a15920
              Message
            </button>
            <button
              onClick={() => navigate(`/profile/${emp.id}`)}
              className="flex-1 bg-[#266ECD] hover:bg-[#1a5bb5] text-white rounded-full py-1.5 text-sm font-medium transition"
            >
              View Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Ecard;