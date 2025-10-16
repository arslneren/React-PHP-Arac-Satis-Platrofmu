import { useEffect, useState } from 'react';
import Header from '../components/Header';
import ListingCard from '../components/ListingCard';
import '../assets/home.css';
import axios from 'axios';

export default function Home() {
  const [cars, setCars] = useState([]);
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 4;

  const fetchCars = (fetchStart) => {
    axios.get(`http://localhost/satis-portali/getProducts.php?start=${fetchStart}`, {
      withCredentials: true
    })
    .then(response => {
      const newCars = response.data;

      if (newCars.length < LIMIT) {
        setHasMore(false);
      }

      setCars(prevCars => [...prevCars, ...newCars]);

      setStart(fetchStart + LIMIT);
    })
    .catch(error => {
      console.error("Ürünler alınamadı:", error);
    });
  };

  useEffect(() => {
    fetchCars(0);
  }, []);

  return (
    <div className="page-root">
      <Header />

      <main className="container">
        <section className="listings-grid">
          {cars.length > 0 ? (
            cars.map((car) => (
              <ListingCard key={car.id} car={car} />
            ))
          ) : (
            <p>Ürün bulunamadı ya da giriş yapılmadı.</p>
          )}
        </section>

        {hasMore && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button onClick={() => fetchCars(start)}>Daha fazla yükle</button>
          </div>
        )}
      </main>
    </div>
  );
}
