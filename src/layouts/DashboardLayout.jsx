import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0b1120] to-[#020617] text-[#ddeeff]">
      <Sidebar />
      <div className="ml-64 min-h-screen">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-[#0b1120]/95 backdrop-blur-xl border-b border-[#1f2937] px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm text-[#88aaff] font-medium">Welcome Back</h2>
              <p className="text-[#ddeeff] font-semibold">John Doe</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-[#1f2937] rounded-lg transition-colors">
                🔔
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-[#aaccff] to-[#88aaff] rounded-full flex items-center justify-center font-bold text-[#020617]">
                JD
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
