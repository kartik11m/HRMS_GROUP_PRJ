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