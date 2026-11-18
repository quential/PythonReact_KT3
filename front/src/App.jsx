import { useState, useEffect } from "react";

const ImageProcessor = () => {
  const [previewSrc, setPreviewSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      if (previewSrc) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true)
    setError(null)
    setPreviewSrc(null)

    const formData = new FormData();
    formData.append('file', file)

    try{
      // Полный URL к бэкенду
      const res = await fetch('http://localhost:8000/process-image', {
        method: "POST",
        body: formData,
      });
      if (!res.ok){
        throw new Error(`Ошибка сервера: ${res.status}`);
      }
      const blob = await res.blob();
      const newSrc = URL.createObjectURL(blob);
      setPreviewSrc(newSrc)
    } catch (e) {
      console.error(e)
      setError(e.message || 'Произошла ошибка при обработке изображения')
    } finally {
      setLoading(false)
    }
  }
}