import { Card } from '../components/MidnightFrostComponents';

const ProfileReferrals = () => {
  const referrals = [
    { name: 'Alice Johnson', position: 'Referred for Frontend Developer', status: 'Active' },
    { name: 'Bob Smith', position: 'Referred for Backend Developer', status: 'Hired' },
    { name: 'Carol Williams', position: 'Referred for UI/UX Designer', status: 'Interviewing' },
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-[#ddeeff] mb-4">Referrals</h3>
      <div className="space-y-3">
        {referrals.map((ref, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <p className="text-[#88aaff]">{ref.name}</p>
              <p className="text-[#1f2937] text-sm">{ref.position}</p>
            </div>
            <span className={`px-2 py-1 rounded text-sm ${
              ref.status === 'Hired' ? 'bg-green-600 text-white' :
              ref.status === 'Active' ? 'bg-[#aaccff] text-[#020617]' :
              'bg-[#88aaff] text-[#020617]'
            }`}>
              {ref.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProfileReferrals;
