import React from 'react';
import SignUp from './LoginComponents/SignUp';
import SignIn from './LoginComponents/SignIn';
import Dashboard from './HomePage/Dashboard';
import Navbar from './components/Navbar';
import Allergies from './components/Allergies'; // Import the new Allergies page
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Scanner from './components/Scanner';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar /> {/* Add Navbar here for global access */}
      <Routes>
        <Route path='/' element={<SignUp />} />
        <Route path='/login' element={<SignIn />} />
        <Route path='/home' element={<Dashboard />} />
        <Route path='/allergies' element={<Allergies />} /> {/* Add the allergies route */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
