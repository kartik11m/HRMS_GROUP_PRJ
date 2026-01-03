import { Card, Button } from '../components/MidnightFrostComponents';

const ProfileDisplay = () => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-[#ddeeff] mb-4">Display Settings</h3>
      <p className="text-[#88aaff] mb-4">Customize your display preferences</p>
      <Button onClick={() => alert('Open display settings')}>Display Settings</Button>
    </Card>
  );
};

export default ProfileDisplay;
