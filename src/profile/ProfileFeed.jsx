import { Card } from '../components/MidnightFrostComponents';

const ProfileFeed = () => {
  const feedItems = [
    { id: 1, type: 'Update', content: 'Profile information updated', time: '2 hours ago' },
    { id: 2, type: 'Activity', content: 'Viewed 5 job applications', time: '4 hours ago' },
    { id: 3, type: 'Notification', content: 'New interview scheduled', time: '1 day ago' },
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-[#ddeeff] mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {feedItems.map((item) => (
          <div key={item.id} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-[#aaccff] rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-[#88aaff]">{item.content}</p>
              <p className="text-[#1f2937] text-sm">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProfileFeed;
