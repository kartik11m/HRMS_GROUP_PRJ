import { Card, Button } from '../components/MidnightFrostComponents';

const ProfileClearHistory = () => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-[#ddeeff] mb-4">Clear History</h3>
      <p className="text-[#88aaff] mb-4">Clear your browsing and activity history</p>
      <Button onClick={() => alert('History cleared!')}>Clear History</Button>
    </Card>
  );
};

export default ProfileClearHistory;
