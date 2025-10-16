import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'

export default function SessionChecker() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const allowedOpen = ['/login', '/register']
    const authChecked = sessionStorage.getItem('authChecked') === '1'
    if (authChecked) {
      if (sessionStorage.getItem('loggedIn') === '1') {
        const uname = sessionStorage.getItem('username') || sessionStorage.getItem('email')
        const mail = sessionStorage.getItem('email')
        if (uname || mail) {
          const maxAge = 7 * 24 * 60 * 60
          const cookieOpts = `path=/; max-age=${maxAge}; SameSite=Lax`
          if (uname) document.cookie = `username=${encodeURIComponent(uname)}; ${cookieOpts}`
          if (mail) document.cookie = `email=${encodeURIComponent(mail)}; ${cookieOpts}`
        }
      }
      return
    }

    let mounted = true
    axios.get(import.meta.env.VITE_ME_URL || 'http://localhost/satis-portali/me.php', { withCredentials: true })
      .then(res => {
        if (!mounted) return
        sessionStorage.setItem('authChecked', '1')

        if (res.data?.loggedIn) {
          sessionStorage.setItem('loggedIn', '1')
          if (res.data.userid) sessionStorage.setItem('userid', String(res.data.userid))
          if (res.data.email) sessionStorage.setItem('email', String(res.data.email))
          if (res.data.username) sessionStorage.setItem('username', String(res.data.username))

          const uname = res.data.username || res.data.email || sessionStorage.getItem('email')
          const mail = res.data.email || sessionStorage.getItem('email')
          if (uname || mail) {
            const maxAge = 7 * 24 * 60 * 60
            const cookieOpts = `path=/; max-age=${maxAge}; SameSite=Lax`
            if (uname) document.cookie = `username=${encodeURIComponent(uname)}; ${cookieOpts}`
            if (mail) document.cookie = `email=${encodeURIComponent(mail)}; ${cookieOpts}`
          }
        } else {
          sessionStorage.removeItem('loggedIn')
          sessionStorage.removeItem('userid')
          sessionStorage.removeItem('email')
          sessionStorage.removeItem('username')
          document.cookie = 'username=; Max-Age=0; path=/;'
          document.cookie = 'email=; Max-Age=0; path=/;'
          if (!allowedOpen.includes(location.pathname)) {
            navigate('/login', { replace: true })
          }
        }
      })
      .catch(err => {
        console.error('Session check failed', err)
        if (!mounted) return
        sessionStorage.setItem('authChecked', '1')
        sessionStorage.removeItem('loggedIn')
        sessionStorage.removeItem('userid')
        sessionStorage.removeItem('email')
        sessionStorage.removeItem('username')
        document.cookie = 'username=; Max-Age=0; path=/;'
        document.cookie = 'email=; Max-Age=0; path=/;'
        if (!allowedOpen.includes(location.pathname)) {
          navigate('/login', { replace: true })
        }
      })

    return () => { mounted = false }
  }, [navigate, location.pathname])

  return null
}