import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import ContactUs from '../components/ContactUs';
import Dashboard from '../components/Dashboard';
import Home from "../components/Home"
import Login from '../components/Login';
import { Purpose } from '../components/Purpose';
import PurposeStage2 from '../components/PurposeStage2';
import SignUp from '../components/SignUp';

const Navigation = () => {
  return (
    <>
      <Router>

        {/* <Navbar title="ReactJsDemo" aboutText="About Us" mode={mode} toggleMode={toggleMode} />
              <Alert alert={alert} /> */}

        <Routes>
          {/* exact is used to match exact path  if we not use exact react use partial path*/}
          {/* <Route exact path="/about" element={<About />}>
                      </Route> */}
          {/* <Route exact path="/textform" element={<TextForm showAlert={showAlert} heading="Enter the text to analyze below" mode={mode} />}>
                      </Route> */}
          <Route exact path="/" element={<Home />} />
          <Route path="/index" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/purpose" element={<Purpose />} />
          <Route path="/purposestage2" element={<PurposeStage2 />} />
          <Route path="/contactus" element={<ContactUs />} />
        </Routes>

      </Router>
    </>
  )
}

export default Navigation
