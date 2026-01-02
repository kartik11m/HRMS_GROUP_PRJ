import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const settingsItems = [
    'Notification',
    'Dark Mode',
    'Rate App',
    'Share Link',
    'Privacy Policy',
    'Terms and Conditions',
    'Cookies Policy',
    'Contact',
    'Feedback',
    'Logout'
  ];

  return (
    <div className="p-6 sm:p-10 max-w-[1600px] mx-auto min-h-screen bg-[#f9fafb] dark:bg-[#0C1014] transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-[#AACCFF] tracking-tight">System Settings</h1>
        <p className="text-gray-500 dark:text-[#88AAFF] mt-1">Configure your workspace and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Settings List */}
        <div className="lg:col-span-2 space-y-6">
          {/* HRMS Card */}
          <div className="bg-white dark:bg-[#1F2429] rounded-xl shadow-sm border border-gray-100 dark:border-[#1F2429] p-6 flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 dark:bg-[#2C50AB] rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
                <span className="text-white font-bold text-xl">HR</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-[#AACCFF]">HRMS Pro</h2>
                <p className="text-gray-500 dark:text-[#88AAFF] text-sm">v2.4.0 • Enterprise Edition</p>
              </div>
            </div>
            <button className="bg-blue-50 dark:bg-[#2C50AB] text-blue-700 dark:text-[#AACCFF] hover:bg-blue-100 dark:hover:bg-[#88AAFF] dark:hover:text-[#0C1014] px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors border border-blue-100 dark:border-[#2C50AB]">
              Manage Subscription
            </button>
          </div>

          {/* Settings List */}
          <div className="bg-white dark:bg-[#1F2429] rounded-xl shadow-sm border border-gray-100 dark:border-[#1F2429] overflow-hidden text-sm font-medium transition-colors duration-300">
            {settingsItems.map((item, index) => (
              <div
                key={item}
                className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#88AAFF]/10 cursor-pointer transition-colors group ${index !== settingsItems.length - 1 ? 'border-b border-gray-50 dark:border-[#1F2429]' : ''
                  }`}
                onClick={async () => {
                  if (item === 'Logout') {
                    const { logout } = await import("../services/auth.service.js");
                    await logout();
                  } else if (item === 'Dark Mode') {
                    toggleDarkMode();
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${item === 'Logout' ? 'bg-red-500' : 'bg-blue-600 dark:bg-[#88AAFF]'} opacity-0 group-hover:opacity-100 transition-opacity`}></span>
                  <span className={`${item === 'Logout' ? 'text-red-600' : 'text-gray-700 dark:text-[#AACCFF] group-hover:text-gray-900 dark:group-hover:text-white'}`}>{item}</span>
                  {item === 'Dark Mode' && (
                    <div className={`ml-2 w-10 h-5 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-[#2C50AB]' : 'bg-gray-300'} relative`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isDarkMode ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                    </div>
                  )}
                </div>
                <span className="text-gray-400 dark:text-[#88AAFF] group-hover:text-gray-600 dark:group-hover:text-white">›</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Images/Widgets */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1F2429] rounded-xl shadow-sm border border-gray-100 dark:border-[#1F2429] p-5 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <h3 className="text-gray-900 dark:text-[#AACCFF] font-semibold text-sm">System Status</h3>
            </div>
            <div className="bg-gray-50 dark:bg-[#0C1014] rounded-lg p-4 border border-dashed border-gray-200 dark:border-[#1F2429] text-center">
              <div className="text-green-600 dark:text-green-400 font-medium text-sm">All Systems Operational</div>
              <p className="text-xs text-gray-500 dark:text-[#88AAFF] mt-1">Last checked: 2 mins ago</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1F2429] rounded-xl shadow-sm border border-gray-100 dark:border-[#1F2429] p-5 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <h3 className="text-gray-900 dark:text-[#AACCFF] font-semibold text-sm">Storage Usage</h3>
            </div>
            <div className="w-full bg-gray-100 dark:bg-[#0C1014] rounded-full h-2 mb-2">
              <div className="bg-blue-600 dark:bg-[#2C50AB] h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-[#88AAFF]">
              <span>45 GB used</span>
              <span>100 GB total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;