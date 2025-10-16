import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Header from '../components/Header';
import ListingCard from '../components/ListingCard';

import '../assets/home.css';
import '../assets/listing.css';

export default function Profile() {
    const navigate = useNavigate();
    const [myListings, setMyListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost/satis-portali/my_listings.php';
    const DELETE_API_URL = 'http://localhost/satis-portali/deleteProduct.php';

    const isSeller = sessionStorage.getItem('status') === '0';

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(API_URL, {
                    withCredentials: true
                });

                if (Array.isArray(response.data)) {
                    setMyListings(response.data);
                    setError(null);
                } else if (response.data && response.data.error) {
                    setError(response.data.error);
                    setMyListings([]);
                } else {
                    setError("API'den beklenmedik veri formatı.");
                    setMyListings([]);
                }
            } catch (err) {
                let errMessage = "İlanları çekerken beklenmeyen bir sunucu hatası oluştu.";
                if (err.response) {
                    if (err.response.status === 403) {
                        errMessage = "Bu bilgilere erişim yetkiniz yok.";
                    } else if (err.response.status === 401) {
                        errMessage = "Oturum sona erdi. Lütfen tekrar giriş yapın.";
                    } else if (err.response.data && err.response.data.error) {
                         errMessage = err.response.data.error;
                    }
                }
                setError(errMessage);
                setMyListings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    const handleDelete = async (productId) => {
        if (!window.confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            const response = await axios.post(
                DELETE_API_URL,
                { id: productId },
                { withCredentials: true }
            );

            if (response.data.success) {
                alert(response.data.message);
                
                setMyListings(prevListings => 
                    prevListings.filter(car => car.id != productId)
                );
            } else {
                alert(`Silme başarısız: ${response.data.error || response.data.message}`);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Sunucu ile iletişimde hata oluştu.';
            alert(`Silme hatası: ${errorMessage}`);
        }
    };


    return (
        <>
            <Header /> 
            
            <main className="container" style={{ maxWidth: 1000 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0' }}>
                    <h2>{isSeller ? 'Araçlarım' : 'Profil'}</h2>
                    
                    {isSeller && (
                        <button 
                            onClick={() => navigate('/new')} 
                            style={{ padding: '0.5rem 1rem', borderRadius: 8, background: 'linear-gradient(90deg,#7c3aed,#06b6d4)', color: '#fff', border: 'none' }}>
                            Yeni Araç Ekle
                        </button>
                    )}
                </div>

                {loading && (
                    <div style={{ padding: '2rem', background: '#fff', borderRadius: 8, textAlign: 'center' }}>Yükleniyor...</div>
                )}

                {error && (
                    <div className="error" style={{ marginBottom: '1rem', color: 'red' }}>Hata: {error}</div>
                )}

                {!loading && myListings.length === 0 && !error ? (
                    <div style={{ padding: '2rem', background: '#fff', borderRadius: 8, textAlign: 'center' }}>
                        Henüz herhangi bir ilan bulunmamaktadır.
                    </div>
                ) : (
                    <section className="listings-grid">
                        {myListings.map((car) => (
                            <ListingCard 
                                key={car.id} 
                                car={car} 
                                isSeller={isSeller}
                                onDelete={() => handleDelete(car.id)} 
                            />
                        ))}
                    </section>
                )}
            </main>
        </>
    )
}