import { NavLink, Outlet } from 'react-router-dom';
import { Card, Section } from '../components/MidnightFrostComponents';

const SettingsLayout = () => {
  const navItems = [
    { path: 'contact', label: 'Account & Contact', icon: '👤' },
    { path: 'feedback', label: 'Feedback & Legal', icon: '📝' },
  ];

  return (
    <div className="space-y-8">
      <Section title="Settings & Preferences" subtitle="Manage your account and application preferences">
        <Card className="mb-6">
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#aaccff] to-[#88aaff] text-[#020617] shadow-lg shadow-[#aaccff]/30'
                      : 'text-[#88aaff] hover:bg-[#1f2937] hover:text-[#aaccff]'
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </Card>
      </Section>

      <Outlet />
    </div>
  );
};

export default SettingsLayout;
