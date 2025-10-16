import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/listing.css';

export default function ListingCard({ car, onDelete, isSeller }) {
    const navigate = useNavigate();
    
    const handleDetailClick = () => {
        navigate(`/detail/${car.id}`);
    };
    
    const handleEditClick = () => {
        navigate(`/edit/${car.id}`); 
    };

    return (
        <article className="listing-card">
            <img src={car.image} alt={car.title} />

            <div className="meta">
                <h3>{car.title}</h3>
                <p className="price">{car.price}</p>
                
                <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    marginTop: '10px',
                    flexDirection: isSeller ? 'row' : 'column' 
                }}>
                    
                    <button 
                        onClick={handleDetailClick}
                        style={{ 
                            padding: '8px 12px', 
                            background: '#3b82f6',
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer',
                            flexGrow: 1 
                        }}
                    >
                        Detay
                    </button>
                    
                    {isSeller && (
                        <>

                            <button 
                                onClick={handleEditClick}
                                style={{ 
                                    padding: '8px 12px', 
                                    background: '#f59e0b',
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: '4px', 
                                    cursor: 'pointer',
                                    flexGrow: 1
                                }}
                            >
                                Düzenle
                            </button>

                            <button 
                                onClick={onDelete}
                                style={{ 
                                    padding: '8px 12px', 
                                    background: '#ef4444',
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: '4px', 
                                    cursor: 'pointer',
                                    flexGrow: 1
                                }}
                            >
                                Sil
                            </button>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
}