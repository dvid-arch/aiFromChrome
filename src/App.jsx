import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'
import Dashboard from './pages/Dashboard'
import Setting from './pages/Setting'
import LandingPage from './pages/LandingPage'
import TransactionsPage from './pages/Transactions';
import Auth from './pages/Auth';
import NoInvestmentsDashboard from './pages/DashboardUn';
import Grad from './pages/Grad';

function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/grad' element={<Grad />} />
          <Route path='/dashboardnon' element={<NoInvestmentsDashboard />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/transactions' element={<TransactionsPage />} />
          <Route path='/settings' element={<Setting />} />
          <Route path='/' element={<LandingPage />} />
          
          
          {/* <Setting /> */}
        </Routes>
      </Router>
    </>
  )
}

export default App
