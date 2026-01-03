import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Profile from '../profile/Profile';
import Jobs from '../recruitment/Jobs';
import Applications from '../recruitment/Applications';
import Interviews from '../recruitment/Interviews';
import Offers from '../recruitment/Offers';
import RecruitmentLayout from '../recruitment/RecruitmentLayout';
import Contact from '../settings/Contact';
import Feedback from '../settings/Feedback';
import SettingsLayout from '../settings/SettingsLayout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Profile />} />
        <Route path="profile" element={<Profile />} />
        <Route path="recruitment" element={<RecruitmentLayout />}>
          <Route index element={<Jobs />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="applications" element={<Applications />} />
          <Route path="interviews" element={<Interviews />} />
          <Route path="offers" element={<Offers />} />
        </Route>
        <Route path="settings" element={<SettingsLayout />}>
          <Route index element={<Feedback />} />
          <Route path="contact" element={<Contact />} />
          <Route path="feedback" element={<Feedback />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
