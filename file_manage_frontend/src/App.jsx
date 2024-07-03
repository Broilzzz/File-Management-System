import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Hero from './components/pages/Hero';
import RegisterForm from './components/auth/RegisterForm';
import LoginForm from './components/auth/LoginForm';
import UserDashBoard from './components/dashboard/UserDashBoard';
import ProtectedRoute from './ProtectedRoute';
import MyDocs from './components/pages/MyDocs';
import Users from './components/pages/Users';
import FileDetails from './components/dashboard/FileDetails';
import Profile from './components/pages/Profile';
import Password from './components/pages/Password';
import Permissions from './components/pages/Permissions';

function App() {

  return (
    <Routes>

      {/* open routes*/}
      <Route path="/" element={<Hero />} />
      <Route path="/signup" element={<RegisterForm />} />
      <Route path="/signin" element={<LoginForm/>} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute/>}>

        <Route path="/dashboard" element={<UserDashBoard />} />
        <Route path='/dashboard/details/:fileNumber' element={<FileDetails/>}/>
        <Route path="/MyDocs" element={<MyDocs />} />
        <Route path="/UsersView" element={<Users />} />
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/password' element={<Password/>} />
        <Route path='/permissions' element={<Permissions/>}/>

      </Route>

    </Routes>
  );
}

export default App;
