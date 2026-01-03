import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { path: '/profile', label: 'Profile', icon: '👤', badge: null },
    { path: '/recruitment', label: 'Recruitment', icon: '📋', badge: '12' },
    { path: '/settings', label: 'Settings', icon: '⚙️', badge: null },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-[#2c50ab] to-[#1f3a7d] text-[#ddeeff] p-6 shadow-2xl border-r border-[#88aaff]/20">
      {/* Logo/Header */}
      <div className="mb-12">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#aaccff] to-[#88aaff] rounded-lg flex items-center justify-center font-bold text-[#020617]">
            HR
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ddeeff] to-[#aaccff] bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>
        <p className="text-[#88aaff] text-xs font-medium ml-12">Recruitment Platform</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-r from-[#aaccff] to-[#88aaff] text-[#020617] shadow-lg shadow-[#aaccff]/30'
                  : 'text-[#ddeeff] hover:bg-[#88aaff]/20 hover:text-[#aaccff]'
              }`
            }
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="font-semibold">{item.label}</span>
            </div>
            {item.badge && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="absolute bottom-6 left-6 right-6 border-t border-[#88aaff]/20 pt-4">
        <div className="bg-[#1f3a7d]/50 rounded-lg p-3 backdrop-blur-sm">
          <p className="text-[#aaccff] text-xs font-medium">Admin Account</p>
          <p className="text-[#88aaff] text-xs">john.doe@company.com</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
