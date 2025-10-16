import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Detail from './pages/Detail'
import Edit from './pages/Edit'
import Profile from './pages/Profile'
import NewListing from './pages/NewListing'
import Search from './pages/Search'
import Logout from './pages/Logout'
import Authenticator from './components/authenticator'
import './App.css'
import SellerRoute from './components/SellerRoute'


function App() {
  return (
    <BrowserRouter>
        <Authenticator />

      <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/search" element={<Search />} />
  <Route 
            path="/profile" 
            element={<SellerRoute><Profile /></SellerRoute>} 
          />
          <Route 
            path="/new" 
            element={<SellerRoute><NewListing /></SellerRoute>} 
          />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
