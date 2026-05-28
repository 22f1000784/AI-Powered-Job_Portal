import { createBrowserRouter } from "react-router-dom";
import HomePage from "../components/homePage";
import Login from "../components/Login";
import Signup from "../components/Signup";
import NotFound from "../components/NotFound";
import CandidateDashboard from "../components/CandidateDashboard";
import { requireAuth } from "./authLoader";
import JobDetails from "../components/JobDetails";
import MyApplications from "../components/MyApplications";
import CandidateProfile from "../components/candidateProfile";
import RecommendedJobs from "../components/RecommendedJobs";
import RecruiterDashboard from "../components/RecruiterDashboard";
import ShortlistPage from "../components/ShortlistPage";
import PostJob from "../components/PostJob";
import ApplicantsPage from "../components/ApplicantsPage";
import ShortlistedSummary from "../components/ShortlistedSummary";
import AdminDashboard from "../components/adminDashboard";
import AdminUsers from "../components/AdminUsers";
import AdminJobs from "../components/AdminJobs";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/candidate/dashboard",
    element: <CandidateDashboard />,
    loader: requireAuth("CANDIDATE"),
  },
  {
    path: "/candidate/job/:id",
    element: <JobDetails />,
    loader: requireAuth("CANDIDATE"),
  },
  {
    path: "/candidate/applications",
    element: <MyApplications />,
    loader: requireAuth("CANDIDATE"),
  },
  {
    path: "/candidate/profile",
    element: <CandidateProfile />,
    loader: requireAuth("CANDIDATE"),
  },
  {
    path: "/candidate/recommendations",
    element: <RecommendedJobs />,
    loader: requireAuth("CANDIDATE"),
  },
  {
    path: "/recruiter/dashboard",
    element: <RecruiterDashboard />,
    loader: requireAuth("RECRUITER"),
  },
  {
    path: "/recruiter/shortlist/:jobId",
    element: <ShortlistPage />,
    loader: requireAuth("RECRUITER"),
  },
  {
    path: "/recruiter/post-job",
    element: <PostJob />,
    loader: requireAuth("RECRUITER"),
  },
  {
    path: "/recruiter/applicants/:jobId",
    element: <ApplicantsPage />,
    loader: requireAuth("RECRUITER"),
  },
  {
    path: "/recruiter/shortlisted-summary",
    element: <ShortlistedSummary />,
    loader: requireAuth("RECRUITER"),
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    loader: requireAuth("ADMIN"),
  },
  {
    path: "/admin/users",
    element: <AdminUsers />,
    loader: requireAuth("ADMIN"),
  },
  {
    path: "/admin/jobs",
    element: <AdminJobs />,
    loader: requireAuth("ADMIN"),
  },
  { path: "*", element: <NotFound /> }
]);