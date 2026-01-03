import { Card } from '../components/MidnightFrostComponents';

const ProfileLocations = () => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-[#ddeeff] mb-4">Locations</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[#88aaff]">New York, NY</span>
          <span className="text-[#aaccff]">Primary</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#88aaff]">San Francisco, CA</span>
          <span className="text-[#aaccff]">Remote</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#88aaff]">London, UK</span>
          <span className="text-[#aaccff]">Travel</span>
        </div>
      </div>
    </Card>
  );
};

export default ProfileLocations;
