import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Çıkış yapılıyor...');

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axios.post("http://localhost/satis-portali/logout.php", {}, {
          withCredentials: true
        });


        sessionStorage.clear();
        sessionStorage.removeItem('authChecked')

        document.cookie.split(';').forEach(c => {
          const eqPos = c.indexOf('=');
          const name = eqPos > -1 ? c.substr(0, eqPos) : c;
          document.cookie = c
            .replace(/^ */, '')
            + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
        });

        navigate("/login");
      } catch (error) {
        console.error("Logout hatası:", error);
        setMessage("Çıkış sırasında bir hata oluştu.");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <div style={{
      textAlign: 'center',
      marginTop: '20%',
      fontSize: '1.5rem',
      fontFamily: 'sans-serif'
    }}>
      ✅ {message}
    </div>
  );
}

export default Logout;
