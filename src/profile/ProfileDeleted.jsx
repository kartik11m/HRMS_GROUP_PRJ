import { Card, Button } from '../components/MidnightFrostComponents';

const ProfileDeleted = () => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-[#ddeeff] mb-4">Deleted Items</h3>
      <p className="text-[#88aaff] mb-4">Manage your deleted files and data</p>
      <Button onClick={() => alert('View deleted items')}>View Deleted Items</Button>
    </Card>
  );
};

export default ProfileDeleted;
