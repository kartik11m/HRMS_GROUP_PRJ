import { useState } from "react";
import EmployeesStatistics from "../components/Dashboard1/EmployeesStatistics.jsx";
import StatsCards from "../components/Dashboard1/StatsCard.jsx";
// import EmpComposition from "./components/Emp_Composition/emp_comp";
import MeetingsUI from "../components/Dashboard1/MeetingsUI.jsx";

function Dashboard1() {
  const [count, setCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-48' : 'ml-0'} `}>
        {currentPage === "Dashboard" && (
          <div className="p-4 sm:p-8">
            <h1 className="text-xl font-bold text-blue-600 mb-6">Dashboard</h1>
            <StatsCards />
            <div className="mt-2">
              <EmployeesStatistics />
            </div>
            <div className="mt-8 flex flex-col lg:flex-row items-start gap-6">
              <div className="flex-1 w-full lg:max-w-lg">
                <MeetingsUI />
              </div>
              {/* <div className="w-full lg:w-48 flex justify-center lg:justify-start">
                <EmpComposition />
              </div> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
}


export default Dashboard1;