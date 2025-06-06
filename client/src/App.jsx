import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import Diagonasis from './pages/Diagonasis';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route element={<PrivateRoute />} >
         <Route path='/' element={<Dashboard />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/diagonasis' element={<Diagonasis />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
