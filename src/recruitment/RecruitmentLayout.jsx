import { NavLink, Outlet } from 'react-router-dom';
import { Card, Section } from '../components/MidnightFrostComponents';

const RecruitmentLayout = () => {
  const navItems = [
    { path: 'jobs', label: 'Open Positions', icon: '💼' },
    { path: 'applications', label: 'Applications', icon: '📥' },
    { path: 'interviews', label: 'Interviews', icon: '💬' },
    { path: 'offers', label: 'Offers', icon: '🎯' },
  ];

  return (
    <div className="space-y-8">
      <Section title="Recruitment Hub" subtitle="Complete recruitment pipeline management">
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

export default RecruitmentLayout;
