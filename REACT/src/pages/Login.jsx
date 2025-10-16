import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/login.css'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (email.trim() && password.trim()) {
      axios.post("http://localhost/satis-portali/loginSuc.php", {
        logMail: email,
        LogPass: password,
      }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      }).then(response => {
        if (response.data === "ok") {
          sessionStorage.setItem('authChecked', 'true');
          navigate('/home')
        } else if (response.data === "3") {
          setMessage("Hatalı şifre");
        } else if (response.data === "1") {
          setMessage("Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı");
        }
        else if(response.data == "5") {
          sessionStorage.setItem('authChecked', 'true');
          navigate('/home')
        }
        else {
          setMessage("Bilinmeyen bir hata oluştu");
        }
      }).catch(error => {
          console.error("Giriş hatası:", error.response ? error.response.data : error.message);
          setMessage("Bağlantı hatası: " + (error.response ? error.response.data : error.message));

      });
    }
  }


  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Giriş Yap</h2>
        <label>
          E-posta
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Şifre
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {message && <div className="error-message">{message}</div>}
        <div className="row">
          <button type="submit">Giriş</button>
          <button type="button" className="secondary" onClick={() => navigate('/register')}>Kayıt Ol </button>
        </div>
      </form>
    </div>
  )
}
