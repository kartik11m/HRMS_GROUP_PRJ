import { Card } from '../components/MidnightFrostComponents';

const ProfileFiles = () => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-[#ddeeff] mb-4">File Management</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[#88aaff]">Documents</span>
          <span className="text-[#aaccff]">12 files</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#88aaff]">Images</span>
          <span className="text-[#aaccff]">8 files</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#88aaff]">Archives</span>
          <span className="text-[#aaccff]">3 files</span>
        </div>
      </div>
    </Card>
  );
};

export default ProfileFiles;
