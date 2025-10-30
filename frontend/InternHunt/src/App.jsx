import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Signup } from "./screen/Signup/Signup";
import { LoginIn } from "./screen/LoginIn/LoginIn";
import { AboutUs } from "./screen/LandingPage/AboutUs/AboutUs";
import { Navbar } from "./components/Navbar/Navbar";
import { Footer } from "./components/Footer/Footer";
import { IntroductionPage } from "./screen/Userpage/IntroductionPage/IntroductionPage";
import { UserNavbar } from "./components/UserNavbar/UserNavbar";
import ProjectListings, { ProjectAdd } from "./screen/Userpage/ProjectListings/ProjectListings";
import ProjectPage from "./screen/Userpage/ProjectPage/ProjectPage";
import { Companypage } from "./screen/Companypage/companypage";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { MentorList } from "./screen/Companypage/MentorList/MentorList";
import { CompanyNavbar } from "./components/CompanyNavbar/CompanyNavbar";
import {
  AccountDashboard,
  AccountPage,
} from "./screen/AccountPage/AccountPage";
import AdminPage from "./screen/AdminPage/AdminPage";
import VerifyEmail from "./screen/Signup/VerifyEmail";
import OtpVerify from "./screen/Signup/OtpVerify";
import ProgressPage from "./screen/Companypage/ProgressPage/ProgressPage";
import NotFound from "./components/NotFound/NotFound";
import ComingSoon from "./components/ComingSoon/ComingSoon";

function App() {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/current-user", { withCredentials: true })
      .then((res) => {
        setUserType(res.data?.user?.userType || null);
      })
      .catch(() => setUserType(null));
  }, []);

  return (
    <>
      <BrowserRouter>
        <MainLayout userType={userType} />
      </BrowserRouter>
    </>
  );
}

const ProjectListingsWrapper = ({userType}) => {
  return (
    <>
      {userType === "User" && <UserNavbar/>}
      {userType === "Company" && <CompanyNavbar/>}
      <ProjectListings />
      <Footer />
    </>
  );
}

function MainLayout({ userType }) {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/intro" ||
    location.pathname === "/project-listings" ||
    location.pathname === "/company-intro" ||
    location.pathname === "/mentor-list" ||
    location.pathname === "/progress-page" ||
    location.pathname === "/admin" ||
    location.pathname === "/account-open";
  return (
    <>
      {/* {!hideNavbar && <Navbar />} */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <AboutUs />
              <Footer />
            </>
          }
        />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginIn />} />
        <Route
          path="/intro"
          element={
            <>
              <UserNavbar />
              <IntroductionPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <>
              <ProjectPage />
              {/* <Footer /> */}
            </>
          }
        />
        <Route
          path="/project-listings"
          element={<ProjectListingsWrapper userType={userType} />}
        />
        <Route
          path="/company-intro"
          element={
            <>
              <CompanyNavbar />
              <Companypage />
              <Footer />
            </>
          }
        />
        <Route
          path="/mentor-list"
          element={
            <>
              <CompanyNavbar />
              <MentorList />
              <Footer />
            </>
          }
        />
        <Route
          path="/progress-page"
          element={
            <>
              <CompanyNavbar />
              <ProgressPage />
              <Footer />
            </>
          }
        ></Route>
        <Route path="/account" element={<AccountPage />} />
        <Route path="/account-open" element={<AccountDashboard />} />
        <Route path="*" element={<NotFound/>} />
        <Route
          path="/admin"
          element={
            <>
              <AdminPage />
            </>
          }
        />
        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route path="/verify-otp" element={<OtpVerify />} />
        {/* <Route path="/admin" element={<AdminPage />} /> */}
        <Route path="/project-add" element={<ProjectAdd/>}></Route>
        <Route path="/under-work" element={<ComingSoon/>}></Route>
      </Routes>
    </>
  );
}

export default App;
