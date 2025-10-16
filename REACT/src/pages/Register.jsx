import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../assets/login.css'

export default function Register() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSeller, setIsSeller] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }

    setError('')
    setSubmitting(true)

    const API_URL = import.meta.env.VITE_REGISTER_URL || 'http://localhost/satis-portali/register.php'
    const payload = {
      regUsername: name,
      regMail: email,
      regPass: password,
      regPassAgain: confirmPassword,
      isSeller: isSeller ? 1 : 0,
    }

    try {
      const res = await axios.post(API_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })

      const data = res.data
      console.log('Register response', data)

      const ok = (typeof data === 'string' && data.trim().toLowerCase() === 'ok')
        || data?.success === true
        || data?.ok === true

      
      if (ok) {
        
        sessionStorage.setItem('authChecked', '1')
        sessionStorage.setItem('loggedIn', '1')
        sessionStorage.setItem('email', email)
        sessionStorage.setItem('username', name)
        if (data?.userid) sessionStorage.setItem('userid', String(data.userid))

        
        const maxAge = 7 * 24 * 60 * 60
        const cookieOpts = `path=/; max-age=${maxAge}; SameSite=Lax`
        document.cookie = `username=${encodeURIComponent(name)}; ${cookieOpts}`
        document.cookie = `email=${encodeURIComponent(email)}; ${cookieOpts}`

        navigate('/home')
        return
      }

      if (data && data.message) setError(data.message)
      else setError('Kayıt başarısız oldu.')
    } catch (err) {
      console.error('Register error', err)
      setError(err?.response?.data?.message || err?.response?.data || err.message || 'Sunucuya bağlanırken hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page colorful">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Kayıt Ol</h2>
        {error && <div className="error">{error}</div>}
        <label>
          E-posta
          <input type="email" name='regMail' value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Adınız
          <input type="text" name='regUsername' value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Şifre
          <input type="password" name='regPass' value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label>
          Şifre (Tekrar)
          <input type="password" name='regPass2' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </label>

        <label className="seller-checkbox">
            Satışcı mısınız?
            <input type="checkbox" className='inputSeller' checked={isSeller} onChange={(e) => setIsSeller(e.target.checked)} />
        </label>

        <div className="row">
          <button type="submit" disabled={submitting}>{submitting ? 'Gönderiliyor...' : 'Kayıt Ol'}</button>
        </div>
      </form>
    </div>
  )
}
