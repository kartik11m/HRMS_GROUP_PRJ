import { Card } from '../components/MidnightFrostComponents';

const ProfileUploads = () => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-[#ddeeff] mb-4">Recent Uploads</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[#88aaff]">resume_john_doe.pdf</span>
          <span className="text-[#aaccff]">2MB</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#88aaff]">portfolio_designs.zip</span>
          <span className="text-[#aaccff]">15MB</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#88aaff]">certification_aws.pdf</span>
          <span className="text-[#aaccff]">1.2MB</span>
        </div>
      </div>
    </Card>
  );
};

export default ProfileUploads;
