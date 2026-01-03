import { Card, Button, Section } from '../components/MidnightFrostComponents';

const Contact = () => {
  return (
    <div className="space-y-8">
      <Section title="Contact Information" subtitle="Manage your account contact details">
        <Card variant="elevated">
          <div className="space-y-6">
            <div>
              <label className="block text-[#ddeeff] font-semibold mb-3">Full Name</label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full px-4 py-3 bg-[#020617] border border-[#1f2937] rounded-lg text-[#ddeeff] focus:outline-none focus:border-[#aaccff] focus:ring-2 focus:ring-[#aaccff]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-[#ddeeff] font-semibold mb-3">Email Address</label>
              <input
                type="email"
                defaultValue="john.doe@company.com"
                className="w-full px-4 py-3 bg-[#020617] border border-[#1f2937] rounded-lg text-[#ddeeff] focus:outline-none focus:border-[#aaccff] focus:ring-2 focus:ring-[#aaccff]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-[#ddeeff] font-semibold mb-3">Phone Number</label>
              <input
                type="tel"
                defaultValue="+1 (555) 123-4567"
                className="w-full px-4 py-3 bg-[#020617] border border-[#1f2937] rounded-lg text-[#ddeeff] focus:outline-none focus:border-[#aaccff] focus:ring-2 focus:ring-[#aaccff]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-[#ddeeff] font-semibold mb-3">Department</label>
              <select className="w-full px-4 py-3 bg-[#020617] border border-[#1f2937] rounded-lg text-[#ddeeff] focus:outline-none focus:border-[#aaccff] focus:ring-2 focus:ring-[#aaccff]/20 transition-all">
                <option>Human Resources</option>
                <option>Engineering</option>
                <option>Product</option>
                <option>Design</option>
              </select>
            </div>
            <div>
              <label className="block text-[#ddeeff] font-semibold mb-3">Office Address</label>
              <textarea
                defaultValue="123 Business St, New York, NY 10001"
                rows={3}
                className="w-full px-4 py-3 bg-[#020617] border border-[#1f2937] rounded-lg text-[#ddeeff] focus:outline-none focus:border-[#aaccff] focus:ring-2 focus:ring-[#aaccff]/20 transition-all resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={() => alert('Contact information updated successfully!')}>Save Changes</Button>
              <Button variant="secondary">Cancel</Button>
            </div>
          </div>
        </Card>
      </Section>

      <Section title="Emergency Contact" subtitle="Secondary contact information">
        <Card>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#ddeeff] font-semibold mb-2">Contact Name</label>
                <input
                  type="text"
                  placeholder="Emergency contact name"
                  className="w-full px-4 py-2 bg-[#020617] border border-[#1f2937] rounded-lg text-[#ddeeff] focus:outline-none focus:border-[#aaccff] transition-all"
                />
              </div>
              <div>
                <label className="block text-[#ddeeff] font-semibold mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Emergency phone"
                  className="w-full px-4 py-2 bg-[#020617] border border-[#1f2937] rounded-lg text-[#ddeeff] focus:outline-none focus:border-[#aaccff] transition-all"
                />
              </div>
            </div>
            <Button variant="secondary">Add Emergency Contact</Button>
          </div>
        </Card>
      </Section>

      <Section title="Communication Preferences">
        <Card>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#aaccff]" />
              <span className="text-[#ddeeff]">Email notifications for new applications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#aaccff]" />
              <span className="text-[#ddeeff]">Weekly recruitment summary</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 accent-[#aaccff]" />
              <span className="text-[#ddeeff]">Marketing and promotional emails</span>
            </label>
            <Button variant="secondary" className="mt-4">Update Preferences</Button>
          </div>
        </Card>
      </Section>
    </div>
  );
};

export default Contact;
