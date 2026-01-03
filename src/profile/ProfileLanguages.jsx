import { Card } from '../components/MidnightFrostComponents';

const ProfileLanguages = () => {
  const languages = [
    { language: 'English', proficiency: 'Native' },
    { language: 'Spanish', proficiency: 'Fluent' },
    { language: 'French', proficiency: 'Intermediate' },
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-[#ddeeff] mb-4">Languages</h3>
      <div className="space-y-3">
        {languages.map((lang, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-[#88aaff]">{lang.language}</span>
            <span className="text-[#aaccff]">{lang.proficiency}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProfileLanguages;
