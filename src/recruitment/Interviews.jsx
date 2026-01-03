import { Card, Button, CardGrid, StatCard, Section, ProgressBar } from '../components/MidnightFrostComponents';

const Interviews = () => {
  const interviews = [
    { id: 1, candidate: 'Alice Johnson', position: 'Senior Frontend Developer', date: '2024-01-15', time: '10:00 AM', status: 'Scheduled', round: '2/3', interviewer: 'Sarah Mitchell' },
    { id: 2, candidate: 'Bob Smith', position: 'Backend Engineer', date: '2024-01-16', time: '2:00 PM', status: 'Completed', round: '3/3', interviewer: 'Tech Lead Team' },
    { id: 3, candidate: 'Emma Davis', position: 'UI/UX Designer', date: '2024-01-17', time: '11:00 AM', status: 'Scheduled', round: '1/2', interviewer: 'Design Manager' },
    { id: 4, candidate: 'Marcus Brown', position: 'Senior Frontend Developer', date: '2024-01-18', time: '9:30 AM', status: 'Scheduled', round: '1/3', interviewer: 'Engineering Team' },
  ];

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Completed':
        return 'bg-gradient-to-r from-green-900/70 to-green-800/50 text-green-300 border border-green-600/50';
      case 'Scheduled':
        return 'bg-gradient-to-r from-blue-900/70 to-blue-800/50 text-blue-300 border border-blue-600/50';
      case 'Pending':
        return 'bg-yellow-900/50 text-yellow-300 border border-yellow-600/50';
      default:
        return 'bg-[#1f2937] text-[#88aaff]';
    }
  };

  return (
    <div className="space-y-8">
      <Section title="Interview Schedule" subtitle="Manage and track all scheduled interviews">
        <CardGrid cols={4}>
          <StatCard title="Scheduled" value="4" icon="📅" trend="2" trendUp={true} />
          <StatCard title="Completed" value="12" icon="✅" trend="5" trendUp={true} />
          <StatCard title="Success Rate" value="75%" icon="🎯" trend="8" trendUp={true} />
          <StatCard title="Avg Score" value="4.5/5" icon="⭐" trend="0" trendUp={true} />
        </CardGrid>
      </Section>

      <div className="space-y-4">
        {interviews.map((interview) => (
          <Card key={interview.id} variant="highlighted">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-[#aaccff] to-[#88aaff] rounded-xl flex items-center justify-center font-bold text-[#020617]">
                  {interview.candidate.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#ddeeff] mb-1">{interview.candidate}</h3>
                  <p className="text-[#aaccff] font-semibold mb-2">{interview.position}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-[#88aaff] text-xs">Date & Time</p>
                      <p className="text-[#ddeeff] font-semibold">{interview.date}</p>
                      <p className="text-[#88aaff] text-sm">{interview.time}</p>
                    </div>
                    <div>
                      <p className="text-[#88aaff] text-xs">Interview Round</p>
                      <p className="text-[#ddeeff] font-semibold">{interview.round}</p>
                    </div>
                    <div>
                      <p className="text-[#88aaff] text-xs">Interviewer</p>
                      <p className="text-[#ddeeff] font-semibold">{interview.interviewer}</p>
                    </div>
                    <div>
                      <p className="text-[#88aaff] text-xs">Candidate Rating</p>
                      <ProgressBar label="" value={Math.floor(Math.random() * 20) + 80} max={100} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3">
                <span className={`px-4 py-2 rounded-lg text-sm font-bold ${getStatusStyle(interview.status)}`}>
                  {interview.status}
                </span>
                <div className="flex gap-2">
                  <Button variant="primary" className="text-xs">View Details</Button>
                  {interview.status === 'Scheduled' && (
                    <Button variant="secondary" className="text-xs">Reschedule</Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Interviews;
