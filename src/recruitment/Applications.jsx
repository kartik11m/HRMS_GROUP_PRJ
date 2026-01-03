import { Card, Button, CardGrid, StatCard, Section } from '../components/MidnightFrostComponents';

const Applications = () => {
  const applications = [
    { id: 1, name: 'Alice Johnson', position: 'Senior Frontend Developer', status: 'Interview Scheduled', rating: 4.8, experience: '6 years', appliedDate: '2 days ago' },
    { id: 2, name: 'Bob Smith', position: 'Backend Engineer', status: 'Under Review', rating: 4.5, experience: '5 years', appliedDate: '3 days ago' },
    { id: 3, name: 'Carol Williams', position: 'Product Manager', status: 'Rejected', rating: 3.2, experience: '3 years', appliedDate: '1 week ago' },
    { id: 4, name: 'David Chen', position: 'Senior Frontend Developer', status: 'Offer Extended', rating: 4.9, experience: '7 years', appliedDate: '5 days ago' },
    { id: 5, name: 'Emma Davis', position: 'UI/UX Designer', status: 'Interview Scheduled', rating: 4.7, experience: '4 years', appliedDate: '4 days ago' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Interview Scheduled':
        return 'bg-blue-900/50 text-blue-300 border border-blue-600/50';
      case 'Under Review':
        return 'bg-yellow-900/50 text-yellow-300 border border-yellow-600/50';
      case 'Offer Extended':
        return 'bg-green-900/50 text-green-300 border border-green-600/50';
      case 'Rejected':
        return 'bg-red-900/50 text-red-300 border border-red-600/50';
      default:
        return 'bg-[#1f2937] text-[#88aaff]';
    }
  };

  return (
    <div className="space-y-8">
      <Section title="Application Pipeline" subtitle="Track and manage all candidate applications">
        <CardGrid cols={5}>
          <StatCard title="Total Applications" value="45" icon="📋" trend="12" trendUp={true} />
          <StatCard title="Under Review" value="18" icon="🔍" trend="5" trendUp={true} />
          <StatCard title="Interviews" value="8" icon="💬" trend="3" trendUp={true} />
          <StatCard title="Offers" value="3" icon="🎯" trend="2" trendUp={true} />
          <StatCard title="Avg Rating" value="4.6" icon="⭐" trend="0" trendUp={true} />
        </CardGrid>
      </Section>

      <div className="space-y-4">
        {applications.map((app) => (
          <Card key={app.id} variant="default">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-[#aaccff] to-[#88aaff] rounded-xl flex items-center justify-center font-bold text-[#020617] text-lg">
                  {app.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-[#ddeeff]">{app.name}</h3>
                    <span className="text-[#aaccff] text-sm">⭐ {app.rating}</span>
                  </div>
                  <p className="text-[#aaccff] font-semibold mb-2">{app.position}</p>
                  <p className="text-[#88aaff] text-sm">💼 {app.experience} experience • Applied {app.appliedDate}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3">
                <span className={`px-4 py-2 rounded-lg text-sm font-bold ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
                <div className="flex gap-2">
                  <Button variant="primary" className="text-xs">View Profile</Button>
                  <Button variant="secondary" className="text-xs">Action</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Applications;
