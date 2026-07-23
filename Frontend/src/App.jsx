
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import ResumeList from "./pages/ResumeList";
import ResumeDetails from "./pages/ResumeDetails";
import JobMatch from "./pages/JobMatch";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ImprovedResume from "./pages/ImproveResume";
function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/upload" element={<UploadResume/>}/>
      <Route path="/resume/:id" element={<ResumeDetails/>}/>
      <Route path="/resumes" element={<ResumeList/>}/>
<Route path="/jobMatch/:id" element={<JobMatch/>}/>
<Route path="/profile" element={<Profile/>}/>
<Route path="/changePassword" element={<ChangePassword/>}/>
<Route path="/forgotpassword" element={<ForgotPassword/>}/>
<Route path="/improvedresume" element={<ImprovedResume/>}/>
    </Routes>
  
    </BrowserRouter>
  )

}
export default App;