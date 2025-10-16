import '../assets/home.css'
import '../assets/newlisting.css'
import { useRef, useState } from 'react'
import axios from 'axios'
import Header from '../components/Header';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { useNavigate } from 'react-router-dom'

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function NewListing() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [imgPreview, setImgPreview] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef(null) 
  const [description, setDescription] = useState('')

  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0) 

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    
    if (!title.trim() || !price.trim()) {
      setError('Lütfen başlık ve fiyat girin.')
      return
    }

    const base64Image = imgPreview
    const desc = description || ''

    const payload = {
      title,
      price,
      desc,
      image_base64: base64Image, 
    }

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/satis-portali/newlisting.php'

    try {
      setUploading(true) 
      setUploadProgress(0) 

      const res = await axios.post(API_URL, payload, {
        withCredentials: true 
      }) 

      setUploading(false)
      navigate('/profile')
      
    } catch (err) {
      console.error('POST error', err)
      setUploading(false)
      setUploadProgress(0)
      
      const errMessage = err.response?.data?.message || 'Sunucuya bağlanırken beklenmeyen bir hata oluştu.'
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

  return (
    <div>
             <Header />

      <div style={{ maxWidth: 1000, margin: '1rem auto' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Yeni Araç Ekle</h2>
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
            Resim Yükle
            <input type="file" accept="image/*" ref={fileRef} onChange={onFileChange} />
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
            <button type="submit" disabled={uploading}>{uploading ? 'Yükleniyor...' : 'İlanı Yayınla'}</button>
            <button type="button" className="secondary" onClick={() => navigate('/profile')}>İptal</button>
          </div>
        </form>
      </div>
    </div>
  )
}