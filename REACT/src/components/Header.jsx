import '../assets/header.css'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import SessionChecker from './SessionChecker'


export default function Header() {
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    
    const menuRef = useRef(null)
    const navigate = useNavigate()

    const isLoggedIn = sessionStorage.getItem('loggedIn') === '1'
    const isSeller = isLoggedIn && sessionStorage.getItem('status') === '0'

    useEffect(() => {
        function onDoc(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('click', onDoc)
        return () => document.removeEventListener('click', onDoc)
    }, [])
    
    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
        } else {
             navigate(`/search`)
        }
    }

    const handleLogout = () => {
        sessionStorage.clear()
        navigate('/login')
    }

    return (
        <header className="site-header">
            <SessionChecker />
            <div className="left">
                <Link to="/home" className="logo">
                    Satis<span>Portali</span>
                </Link>
            </div>
            
            <div className="center">
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <input
                        type="search"
                        className="search" 
                        placeholder="Ara: model, marka, şehir..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="search-button">
                        Ara
                    </button>
                </form>
            </div>

            {isLoggedIn ? (
                <div className="right" ref={menuRef}>
                    <div className="profile" onClick={() => setOpen((s) => !s)}>
                        {sessionStorage.getItem('username') || 'Profil'} ▾
                    </div>
                    {open && (
                        <div className="profile-menu">
                            {isSeller && (
                                <button onClick={() => navigate('/profile')}>Araçlarım</button>
                            )}
                            {isSeller && (
                                <button onClick={() => navigate('/new')}>Yeni Araç Ekle</button>
                            )}
                            <button onClick={handleLogout}>Çıkış</button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="right">
                    <button onClick={() => navigate('/login')}>Giriş / Kayıt</button>
                </div>
            )}
        </header>
    )
}