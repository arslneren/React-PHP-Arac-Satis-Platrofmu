import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Authenticator() {
  const navigate = useNavigate()
  const location = useLocation()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    let mounted = true

    if (sessionStorage.getItem('authChecked') === '1') {
      setChecked(true)
      return
    }

    const allowedOpen = ['/login', '/register']
    axios.get(import.meta.env.VITE_ME_URL || 'http://localhost/satis-portali/me.php', { withCredentials: true })
      .then(res => {
        console.log('me.php response (raw):', res)
        console.log('me.php response data:', res.data)
        if (!mounted) return
        sessionStorage.setItem('authChecked', '1')

        if (res.data?.loggedIn) {
          sessionStorage.setItem('loggedIn', '1')
          if (res.data.userid) sessionStorage.setItem('userid', String(res.data.userid))
          if (res.data.email) sessionStorage.setItem('email', String(res.data.email))
          if (res.data.status !== undefined) sessionStorage.setItem('status', String(res.data.status))

        } else {
          sessionStorage.removeItem('loggedIn')
          sessionStorage.removeItem('userid')
          sessionStorage.removeItem('email')
          if (!allowedOpen.includes(location.pathname)) {
            navigate('/login', { replace: true })
          }
        }
      })
      .catch(err => {
        console.error('me.php request error:', err)
        if (!mounted) return
        sessionStorage.setItem('authChecked', '1')
        sessionStorage.removeItem('loggedIn')
        sessionStorage.removeItem('userid')
        sessionStorage.removeItem('email')
        if (!allowedOpen.includes(location.pathname)) {
          navigate('/login', { replace: true })
        }
      })
      .finally(() => {
        if (mounted) setChecked(true)
      })

    return () => { mounted = false }
  }, [navigate, location.pathname])

  return null
}

export default Authenticator
