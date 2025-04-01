import { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import GuestRoutes from './components/routes/GuestRoutes';
import HomePage from './pages/home/HomePage';
import ContactUsPage from './pages/contactUs/ContactUsPage';
import DARoutes from './components/routes/DARoutes';
import UserProfilePage from './pages/user/profile/UserProfilePage';
import DADashboardPage from './pages/da/dashboard/DADashboardPage';
import VehicleRegistrationForm from './pages/vehicleDataEntry/VehicleDataEntry';

import './App.css'

const App = () => {
  return (
    <Routes>
      {/* Guest Routes */}
      <Route path="/" element={<GuestRoutes />}>
        <Route index element={<HomePage />} />
        <Route path="contact-us" element={<ContactUsPage />} />
      </Route>

      {/* Dealing Assistant Routes */}
      <Route path="/da" element={<DARoutes />}>
        {/* Dashboard */}
        <Route path="dashboard" element={<DADashboardPage />} />
        <Route path="dataentryvehicle" element={<VehicleRegistrationForm />} />

        {/* Profile */}
        <Route path="profile" element={<UserProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App
