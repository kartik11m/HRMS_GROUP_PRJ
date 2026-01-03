import { Card, Section, StatCard, CardGrid, ProgressBar, InfoBox } from '../components/MidnightFrostComponents';
import ProfileFeed from './ProfileFeed';
import ProfileUploads from './ProfileUploads';
import ProfileTasks from './ProfileTasks';
import ProfileFiles from './ProfileFiles';
import ProfileLanguages from './ProfileLanguages';
import ProfileLocations from './ProfileLocations';
import ProfileReferrals from './ProfileReferrals';
import ProfileDeleted from './ProfileDeleted';
import ProfileClearHistory from './ProfileClearHistory';
import ProfileDisplay from './ProfileDisplay';
import ProfileExit from './ProfileExit';

const Profile = () => {
  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card variant="elevated">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#aaccff] to-[#88aaff] rounded-2xl flex items-center justify-center shadow-lg shadow-[#aaccff]/30">
              <span className="text-3xl font-bold text-[#020617]">JD</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#ddeeff]">John Doe</h1>
              <p className="text-[#aaccff] font-semibold mt-1">Senior HR Manager</p>
              <p className="text-[#88aaff] text-sm mt-2">📧 john.doe@company.com | 📱 +1 (555) 123-4567</p>
              <div className="mt-3 flex gap-2">
                <span className="bg-[#2c50ab]/50 text-[#aaccff] text-xs font-bold px-3 py-1 rounded-full">Active</span>
                <span className="bg-green-900/50 text-green-300 text-xs font-bold px-3 py-1 rounded-full">Available</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[#88aaff] text-sm">Member since</p>
            <p className="text-[#ddeeff] font-bold">January 2025</p>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <Section title="Performance Metrics" subtitle="Your recruitment and engagement overview">
        <CardGrid cols={4}>
          <StatCard title="Active Candidates" value="248" icon="👥" trend="12" trendUp={true} />
          <StatCard title="Placements This Year" value="67" icon="✅" trend="8" trendUp={true} />
          <StatCard title="Avg Time to Hire" value="18 days" icon="⏱️" trend="15" trendUp={false} />
          <StatCard title="Team Size" value="12" icon="👨‍💼" trend="2" trendUp={true} />
        </CardGrid>
      </Section>

      {/* Skills & Proficiency */}
      <Section title="Skills & Proficiency" subtitle="Professional competencies and development areas">
        <Card>
          <div className="space-y-6">
            <ProgressBar label="Recruitment Strategy" value={95} max={100} />
            <ProgressBar label="Candidate Assessment" value={88} max={100} />
            <ProgressBar label="Vendor Management" value={92} max={100} />
            <ProgressBar label="Team Leadership" value={85} max={100} />
            <ProgressBar label="Data Analytics" value={78} max={100} />
          </div>
        </Card>
      </Section>

      {/* Dashboard Overview */}
      <Section title="Dashboard Overview" subtitle="Quick insights into your key areas">
        <CardGrid cols={3}>
          <ProfileTasks />
          <ProfileUploads />
          <ProfileFeed />
          <ProfileFiles />
          <ProfileLanguages />
          <ProfileLocations />
        </CardGrid>
      </Section>

      {/* Additional Info */}
      <Section title="Quick Actions & Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoBox 
            icon="📊" 
            title="View Analytics" 
            description="Access detailed recruitment metrics and performance reports"
            actionLabel="Open Dashboard"
          />
          <InfoBox 
            icon="🎓" 
            title="Professional Development" 
            description="Explore training resources and certification programs"
            actionLabel="Browse Resources"
          />
          <InfoBox 
            icon="🤝" 
            title="Referral Program" 
            description="Manage and track your candidate referrals"
            actionLabel="View Referrals"
          />
          <InfoBox 
            icon="📁" 
            title="Document Center" 
            description="Access policies, procedures, and important documents"
            actionLabel="View Documents"
          />
        </div>
      </Section>

      {/* Referrals */}
      <Section title="Recent Referrals & Network">
        <ProfileReferrals />
      </Section>

      {/* Actions */}
      <Section title="Account Management" subtitle="Manage your profile and settings">
        <CardGrid cols={4}>
          <ProfileDeleted />
          <ProfileClearHistory />
          <ProfileDisplay />
          <ProfileExit />
        </CardGrid>
      </Section>
    </div>
  );
};

export default Profile;
