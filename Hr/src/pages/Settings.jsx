import React from 'react';

const Settings = () => {
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
    <div className="p-6 sm:p-10 max-w-[1600px] mx-auto min-h-screen bg-[#f9fafb]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Settings</h1>
        <p className="text-gray-500 mt-1">Configure your workspace and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Settings List */}
        <div className="lg:col-span-2 space-y-6">
          {/* HRMS Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <span className="text-white font-bold text-xl">HR</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">HRMS Pro</h2>
                <p className="text-gray-500 text-sm">v2.4.0 • Enterprise Edition</p>
              </div>
            </div>
            <button className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors border border-blue-100">
              Manage Subscription
            </button>
          </div>

          {/* Settings List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-sm font-medium">
            {settingsItems.map((item, index) => (
              <div
                key={item}
                className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group ${index !== settingsItems.length - 1 ? 'border-b border-gray-50' : ''
                  }`}
                onClick={async () => {
                  if (item === 'Logout') {
                    const { logout } = await import("../services/auth.service.js");
                    await logout();
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${item === 'Logout' ? 'bg-red-500' : 'bg-blue-600'} opacity-0 group-hover:opacity-100 transition-opacity`}></span>
                  <span className={`${item === 'Logout' ? 'text-red-600' : 'text-gray-700 group-hover:text-gray-900'}`}>{item}</span>
                </div>
                <span className="text-gray-400 group-hover:text-gray-600">›</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Images/Widgets */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <h3 className="text-gray-900 font-semibold text-sm">System Status</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-dashed border-gray-200 text-center">
              <div className="text-green-600 font-medium text-sm">All Systems Operational</div>
              <p className="text-xs text-gray-500 mt-1">Last checked: 2 mins ago</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <h3 className="text-gray-900 font-semibold text-sm">Storage Usage</h3>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
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