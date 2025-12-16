import { useState, useEffect } from 'react'
import axios from 'axios';
import Ecard from '../components/Employee/Ecard';

function EmployeesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:3000/api/employees/list', {
          params: { search, department },
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchEmployees();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [search, department]);

  return (
    <div className="flex bg-[#f9fafb] min-h-screen relative font-inter">

      {/* Main Content Area */}
      <div className="w-full transition-all duration-300">

        {/* Mobile Header Bar */}
        <div className="lg:hidden bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-xl font-bold text-gray-800">HRMS</h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 focus:outline-none"
          >
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>

        {/* Content Padding */}
        <div className="p-4 sm:p-8">
          {/* Breadcrumbs & Title */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-gray-500 text-sm mb-1">Employee Management / <span className="text-gray-800 font-semibold">Employees</span></p>
              <h1 className="text-2xl font-bold text-gray-800">Employees Directory</h1>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, role..."
                  className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 w-full sm:w-64"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400 text-sm"></i>
              </div>
              <select
                className="py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 bg-white"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="HR">HR</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No employees found matching your criteria.
            </div>
          ) : (
            <Ecard employees={employees} />
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployeesPage;