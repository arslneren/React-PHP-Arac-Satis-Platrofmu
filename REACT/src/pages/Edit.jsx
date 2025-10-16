import '../assets/home.css'
import '../assets/newlisting.css'
import { useRef, useState, useEffect } from 'react' 
import axios from 'axios'
import Header from '../components/Header';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { useNavigate, useParams } from 'react-router-dom'

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

export default function Edit() {
    const { id } = useParams()
    const navigate = useNavigate()
    
    const [initialLoading, setInitialLoading] = useState(true)
    const [fetchError, setFetchError] = useState(null)
    
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [imgPreview, setImgPreview] = useState(null)
    const [error, setError] = useState('')
    const fileRef = useRef(null) 
    const [description, setDescription] = useState('')

    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0) 

    const FETCH_API_URL = `http://localhost/satis-portali/getProductsDetail.php?id=${id}`;
    const UPDATE_API_URL = 'http://localhost/satis-portali/updateProduct.php';

    useEffect(() => {
        if (!id) {
            setFetchError("Düzenlenecek ürün ID'si bulunamadı.")
            setInitialLoading(false)
            return
        }

        axios.get(FETCH_API_URL, { withCredentials: true })
            .then(response => {
                if (response.data.error) {
                    setFetchError(response.data.error)
                } else {
                    const car = response.data
                    
                    if (!car.title) {
                        setFetchError("Ürün detayları boş geldi. Başka bir satıcıya ait olabilir.")
                        return;
                    }

                    setTitle(car.title || '')
                    
                    setPrice(String(car.price) || '') 
                    
                    setDescription(car.desc || '')
                    setImgPreview(car.image || null) 
                    setFetchError(null)
                }
            })
            .catch(err => {
                const errMsg = err.response?.data?.error || "Ürün detayları çekilemedi. Sunucu hatası veya yetki hatası olabilir."
                setFetchError(errMsg)
            })
            .finally(() => {
                setInitialLoading(false)
            })
    }, [id])

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        
        if (!title.trim() || !String(price).trim()) { 
            setError('Lütfen başlık ve fiyat girin.')
            return
        }

        const base64Image = imgPreview && imgPreview.startsWith('data:image') ? imgPreview : null;
        const desc = description || ''

        
        const payload = {
            id, 
            title,
            price: String(price),
            desc,
            image_base64: base64Image, 
        }

        try {
            setUploading(true) 
            setUploadProgress(0) 

            const res = await axios.post(UPDATE_API_URL, payload, {
                withCredentials: true 
            }) 
            
            setUploading(false)
            alert(res.data.message || "İlan başarıyla güncellendi.")
            navigate('/profile')
            
        } catch (err) {
            console.error('Update error', err)
            setUploading(false)
            setUploadProgress(0)
            
            const errMessage = err.response?.data?.error || 'Sunucuya bağlanırken beklenmeyen bir hata oluştu.'
            setError(`Hata: ${errMessage}`)
        }
    }

    async function onFileChange(e) {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            const data = await readFileAsDataURL(file)
            setImgPreview(data) 
        } catch (err) {
            console.error('Dosya okuma hatası:', err)
            setImgPreview(null)
        }
    }

    if (initialLoading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Ürün bilgileri yükleniyor...</div>
    }

    if (fetchError) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>Hata: {fetchError}</div>
    }

    return (
        <div>
            <Header />
            <div style={{ maxWidth: 1000, margin: '1rem auto' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>İlanı Düzenle (ID: {id})</h2>
                <form className="newlisting-form" onSubmit={handleSubmit}>
                    {error && <div className="error">{error}</div>}

                    <label>
                        İlan Başlığı
                        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </label>

                    <label>
                        Fiyat
                        <input value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </label>

                    <label>
                        Yeni Resim Yükle
                        <input type="file" accept="image/*" ref={fileRef} onChange={onFileChange} />
                        {imgPreview && !imgPreview.startsWith('data:image') && <p style={{fontSize: '0.9em', color: '#666', marginTop: '5px'}}>Mevcut Resim: (Yeni resim yüklerseniz değişecektir)</p>}
                    </label>
                    
                    {imgPreview && <img src={imgPreview} alt="preview" className="preview" />}
                    
                    {uploading && (
                        <div style={{ marginTop: 8 }}>
                            <div style={{ background: '#eee', height: 8, borderRadius: 6, overflow: 'hidden' }}>
                                <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'linear-gradient(90deg,#7c3aed,#06b6d4)' }} />
                            </div>
                            <div style={{ fontSize: 12, marginTop: 6 }}>{uploadProgress > 0 ? `${uploadProgress}%` : 'Gönderiliyor...'}</div>
                        </div>
                    )}

                    <div className="field">
                        <label>Açıklama</label>
                        <div className="editor-wrapper">
                            <CKEditor
                                editor={ClassicEditor}
                                data={description}
                                onChange={(event, editor) => {
                                    const data = editor.getData()
                                    setDescription(data)
                                }}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <button type="submit" disabled={uploading}>
                            {uploading ? 'Güncelleniyor...' : 'İlanı Güncelle'}
                        </button>
                        <button type="button" className="secondary" onClick={() => navigate('/profile')}>İptal</button>
                    </div>
                </form>
            </div>
        </div>
    )
}