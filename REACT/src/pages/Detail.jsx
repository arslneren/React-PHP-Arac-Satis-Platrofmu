import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../assets/detail.css';
import Header from '../components/Header';
import axios from 'axios';

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('Geçersiz ürün ID');
      setLoading(false);
      return;
    }

    axios.get(`http://localhost/satis-portali/getProductsDetail.php?id=${id}`, {
      withCredentials: true
    })
    .then(response => {
      if (response.data.error) {
        setError(response.data.error);
        setCar(null);
      } else {
        setCar(response.data);
        setError(null);
      }
    })
    .catch(() => {
      setError('Veri alınırken hata oluştu');
      setCar(null);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="detail-root">
          <p>Yükleniyor...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="detail-root">
          <p>{error}</p>
          <button onClick={() => navigate('/home')}>Geri</button>
        </div>
      </>
    );
  }

  if (!car) {
    return (
      <>
        <Header />
        <div className="detail-root">
          <p>İlan bulunamadı.</p>
          <button onClick={() => navigate('/home')}>Geri</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="detail-root">
        <button className="back" onClick={() => navigate('/home')}>Geri</button>
        <div className="detail-card">
          <div className="gallery">
            <img src={car.imgs} />
          </div>
          <div className="info">
            <h2>{car.title}</h2>
            <p className="price">{car.price}</p>
            <p className="desc">{car.desc}</p>
          </div>
        </div>
      </div>
    </>
  );
}
