import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import DonorRegistration from "./pages/DonorRegistration";
import OrganizationRegistration from "./pages/OrganizationRegistration";
import DonorLogin from "./pages/donorlogin";
import DonorHome from "./pages/DonorHome";
import DonationItems from "./pages/Donoritems";
import OrganisationLogin from "./pages/organisationlogin";
import OrgHome from "./pages/Orghome";
import OrgPickups from "./pages/OrgPickups";
import DonationItemDetails from "./pages/DonateitemDetails";
import DonationConfirmation from "./pages/DonationConfirmation";
import LeaderBoard from "./pages/donationLeaderBoard";
import History from "./pages/DonationHistory";
import ProtectedRoute from "./components/protectedDom"; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register/donor" element={<DonorRegistration />} />
            <Route path="/register/organization" element={<OrganizationRegistration />} />
            <Route path="/donorlogin" element={<DonorLogin />} />
            <Route path="/organisationlogin" element={<OrganisationLogin />} />

            {/* Protected Routes - Accessible only if donor_id or organizations_id is present */}
            <Route path="/DonorHome" element={<ProtectedRoute element={<DonorHome />} />} />
            <Route path="/donateitems" element={<ProtectedRoute element={<DonationItems />} />} />
            <Route path="/OrgHome" element={<ProtectedRoute element={<OrgHome />} />} />
            <Route path="/orgpickups" element={<ProtectedRoute element={<OrgPickups />} />} />
            <Route path="/item/:id" element={<ProtectedRoute element={<DonationItemDetails />} />} />
            <Route path="/donation-confirmation" element={<ProtectedRoute element={<DonationConfirmation />} />} />
            <Route path="/LeaderBoard" element={<ProtectedRoute element={<LeaderBoard />} />} />
            <Route path="/History" element={<ProtectedRoute element={<History />} />} />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
