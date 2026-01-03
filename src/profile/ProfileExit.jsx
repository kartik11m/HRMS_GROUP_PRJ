import { Card, Button } from '../components/MidnightFrostComponents';

const ProfileExit = () => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-[#ddeeff] mb-4">Exit</h3>
      <p className="text-[#88aaff] mb-4">Log out of your account</p>
      <Button onClick={() => alert('Logged out!')}>Log Out</Button>
    </Card>
  );
};

export default ProfileExit;
