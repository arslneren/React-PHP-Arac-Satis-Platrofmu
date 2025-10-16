import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import ListingCard from '../components/ListingCard';
import '../assets/home.css';

export default function Search() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('q') || '';

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        if (!searchTerm) {
            setResults([]);
            setLoading(false);
            return;
        }

        const API_URL = `http://localhost/satis-portali/search.php?q=${encodeURIComponent(searchTerm)}`;
        
        axios.get(API_URL, { withCredentials: true })
            .then(response => {
                console.log('Arama yanıtı:', response.data);
                if (Array.isArray(response.data)) {
                    setResults(response.data);
                } else if (response.data && response.data.error) {
                    setError(response.data.error);
                    setResults([]);
                } else {
                    setError("Sunucudan beklenmedik veri formatı.");
                    setResults([]);
                }
            })
            .catch(err => {
                const errMsg = err.response?.data?.error || "Arama sonuçları çekilemedi (Oturum kontrolü?).";
                setError(errMsg);
                setResults([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [location.search, searchTerm]);

    return (
        <div className="page-root">
            <Header />

            <main className="container">
                <h2 style={{ marginBottom: '1rem' }}>Arama Sonuçları: "{searchTerm}"</h2>
                
                {loading && (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>Arama yapılıyor, lütfen bekleyin...</div>
                )}
                
                {error && (
                    <div className="error" style={{ color: 'red', marginBottom: '1rem' }}>Hata: {error}</div>
                )}

                {!loading && !error && (
                    <section className="listings-grid">
                        {results.length > 0 ? (
                            results.map((car) => (
                                <ListingCard 
                                    key={car.id} 
                                    car={car} 
                                    isSeller={false} 
                                />
                            ))
                        ) : (
                            <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', background: '#f9f9f9',color:'#050505ff', borderRadius: 8 }}>
                                "{searchTerm}" terimine uygun ilan bulunamadı.
                            </p>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}