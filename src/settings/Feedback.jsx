import { Card, Button, Section } from '../components/MidnightFrostComponents';

const Feedback = () => {
  return (
    <div className="space-y-8">
      <Section title="Send Feedback" subtitle="Help us improve the platform">
        <Card variant="elevated">
          <div className="space-y-6">
            <div>
              <label className="block text-[#ddeeff] font-semibold mb-3">Subject</label>
              <input
                type="text"
                placeholder="What is your feedback about?"
                className="w-full px-4 py-3 bg-[#020617] border border-[#1f2937] rounded-lg text-[#ddeeff] placeholder-[#88aaff]/50 focus:outline-none focus:border-[#aaccff] focus:ring-2 focus:ring-[#aaccff]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-[#ddeeff] font-semibold mb-3">Message</label>
              <textarea
                placeholder="Tell us more about your experience and suggestions..."
                rows={6}
                className="w-full px-4 py-3 bg-[#020617] border border-[#1f2937] rounded-lg text-[#ddeeff] placeholder-[#88aaff]/50 focus:outline-none focus:border-[#aaccff] focus:ring-2 focus:ring-[#aaccff]/20 transition-all resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={() => alert('Feedback submitted successfully!')}>Submit Feedback</Button>
              <Button variant="secondary">Clear</Button>
            </div>
          </div>
        </Card>
      </Section>

      <Section title="Privacy & Legal" subtitle="Important policies and agreements">
        <div className="space-y-4">
          <Card className="border-l-4 border-l-[#aaccff]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#ddeeff] mb-2">Privacy Policy</h3>
                <p className="text-[#88aaff] mb-4">
                  We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information. Your data security is our top priority.
                </p>
              </div>
              <Button variant="secondary" className="text-sm whitespace-nowrap">Read Full Policy</Button>
            </div>
          </Card>

          <Card className="border-l-4 border-l-[#88aaff]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#ddeeff] mb-2">Terms & Conditions</h3>
                <p className="text-[#88aaff] mb-4">
                  By using our services, you agree to these terms. Please read them carefully. These terms govern your use of the platform and your relationship with us.
                </p>
              </div>
              <Button variant="secondary" className="text-sm whitespace-nowrap">Read Full Terms</Button>
            </div>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#ddeeff] mb-2">Cookie Policy</h3>
                <p className="text-[#88aaff] mb-4">
                  We use cookies to enhance your experience. You can manage your cookie preferences at any time through your browser settings.
                </p>
              </div>
              <Button variant="secondary" className="text-sm whitespace-nowrap">Manage Cookies</Button>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
};

export default Feedback;
