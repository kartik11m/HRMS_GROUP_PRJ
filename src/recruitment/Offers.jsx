import { Card, Button, CardGrid, StatCard, Section, ProgressBar } from '../components/MidnightFrostComponents';

const Offers = () => {
  const offers = [
    { id: 1, candidate: 'Alice Johnson', position: 'Senior Developer', status: 'Pending', salary: '$120k', startDate: 'Feb 1, 2024', package: 'Premium' },
    { id: 2, candidate: 'Bob Smith', position: 'Product Manager', status: 'Accepted', salary: '$130k', startDate: 'Jan 15, 2024', package: 'Executive' },
    { id: 3, candidate: 'Carol White', position: 'Designer', status: 'Declined', salary: '$90k', startDate: 'N/A', package: 'Standard' },
    { id: 4, candidate: 'David Martinez', position: 'Senior Developer', status: 'Pending', salary: '$125k', startDate: 'Feb 8, 2024', package: 'Premium' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted':
        return 'bg-gradient-to-r from-green-900/70 to-green-800/50 text-green-300 border border-green-600/50';
      case 'Pending':
        return 'bg-gradient-to-r from-yellow-900/70 to-yellow-800/50 text-yellow-300 border border-yellow-600/50';
      case 'Declined':
        return 'bg-gradient-to-r from-red-900/70 to-red-800/50 text-red-300 border border-red-600/50';
      default:
        return 'bg-[#1f2937] text-[#88aaff]';
    }
  };

  return (
    <div className="space-y-8">
      <Section title="Job Offer Management" subtitle="Track and manage all candidate offers">
        <CardGrid cols={5}>
          <StatCard title="Total Offers" value="18" icon="📋" trend="4" trendUp={true} />
          <StatCard title="Accepted" value="12" icon="✅" trend="3" trendUp={true} />
          <StatCard title="Pending" value="4" icon="⏳" trend="1" trendUp={false} />
          <StatCard title="Declined" value="2" icon="❌" trend="0" trendUp={false} />
          <StatCard title="Acceptance Rate" value="85%" icon="📊" trend="12" trendUp={true} />
        </CardGrid>
      </Section>

      <div className="space-y-4">
        {offers.map((offer) => (
          <Card key={offer.id} variant={offer.status === 'Accepted' ? 'highlighted' : 'default'}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-[#aaccff] to-[#88aaff] rounded-xl flex items-center justify-center font-bold text-[#020617]">
                  {offer.candidate.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#ddeeff] mb-1">{offer.candidate}</h3>
                  <p className="text-[#aaccff] font-semibold mb-3">{offer.position}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                    <div>
                      <p className="text-[#88aaff] text-xs uppercase">Salary</p>
                      <p className="text-[#ddeeff] font-bold">{offer.salary}/yr</p>
                    </div>
                    <div>
                      <p className="text-[#88aaff] text-xs uppercase">Start Date</p>
                      <p className="text-[#ddeeff] font-bold">{offer.startDate}</p>
                    </div>
                    <div>
                      <p className="text-[#88aaff] text-xs uppercase">Package</p>
                      <span className="text-[#aaccff] text-sm font-semibold bg-[#1f2937] px-2 py-1 rounded inline-block mt-1">
                        {offer.package}
                      </span>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-[#88aaff] text-xs uppercase mb-2">Response Deadline</p>
                      <ProgressBar label="" value={Math.floor(Math.random() * 40) + 40} max={100} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3">
                <span className={`px-4 py-2 rounded-lg text-sm font-bold ${getStatusColor(offer.status)}`}>
                  {offer.status}
                </span>
                <div className="flex flex-col gap-2">
                  <Button variant="primary" className="text-xs">View Offer</Button>
                  {offer.status === 'Pending' && (
                    <>
                      <Button variant="secondary" className="text-xs">Send Reminder</Button>
                      <Button variant="ghost" className="text-xs">Withdraw</Button>
                    </>
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

export default Offers;
