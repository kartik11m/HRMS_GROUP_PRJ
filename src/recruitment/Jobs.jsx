import { Card, Button, CardGrid, StatCard, Section, ProgressBar } from '../components/MidnightFrostComponents';

const Jobs = () => {
  const jobs = [
    { id: 1, title: 'Senior Frontend Developer', department: 'Engineering', status: 'Open', applicants: 24, views: 312, salary: '$120k - $150k', posted: '5 days ago' },
    { id: 2, title: 'Backend Engineer', department: 'Engineering', status: 'Open', applicants: 18, views: 287, salary: '$130k - $160k', posted: '8 days ago' },
    { id: 3, title: 'Product Manager', department: 'Product', status: 'Open', applicants: 15, views: 198, salary: '$140k - $170k', posted: '12 days ago' },
    { id: 4, title: 'UI/UX Designer', department: 'Design', status: 'Closed', applicants: 32, views: 423, salary: '$90k - $120k', posted: '20 days ago' },
  ];

  return (
    <div className="space-y-8">
      <Section title="Active Job Listings" subtitle="Manage and monitor your open positions">
        <CardGrid cols={4}>
          <StatCard title="Open Positions" value="3" icon="💼" trend="0" trendUp={true} />
          <StatCard title="Total Applicants" value="57" icon="📥" trend="24" trendUp={true} />
          <StatCard title="Job Views" value="1.2K" icon="👁️" trend="18" trendUp={true} />
          <StatCard title="Applications/Week" value="12" icon="📊" trend="8" trendUp={true} />
        </CardGrid>
      </Section>

      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} variant={job.status === 'Open' ? 'highlighted' : 'default'}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-[#ddeeff]">{job.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    job.status === 'Open' 
                      ? 'bg-gradient-to-r from-green-900/70 to-green-800/50 text-green-300 border border-green-600/50' 
                      : 'bg-[#1f2937] text-[#88aaff] border border-[#2c50ab]'
                  }`}>
                    {job.status}
                  </span>
                  <span className="text-[#88aaff] text-xs">{job.posted}</span>
                </div>
                
                <p className="text-[#aaccff] font-semibold mb-3">📍 {job.department}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-[#88aaff] text-xs uppercase">Applications</p>
                    <p className="text-2xl font-bold text-[#aaccff]">{job.applicants}</p>
                  </div>
                  <div>
                    <p className="text-[#88aaff] text-xs uppercase">Views</p>
                    <p className="text-2xl font-bold text-[#aaccff]">{job.views}</p>
                  </div>
                  <div>
                    <p className="text-[#88aaff] text-xs uppercase">Salary</p>
                    <p className="text-lg font-bold text-[#aaccff]">{job.salary}</p>
                  </div>
                  <div>
                    <p className="text-[#88aaff] text-xs uppercase">Response Rate</p>
                    <ProgressBar label="" value={Math.floor(Math.random() * 30) + 70} max={100} />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button variant="primary" className="text-sm">View Details</Button>
                <Button variant="secondary" className="text-sm">Edit</Button>
                <Button variant="ghost" className="text-sm">Close</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
