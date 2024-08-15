// api.js
const apiUrl = 'http://localhost:25444/Weather';

export const fetchData = async (days) => {
  try {
    const url = `${apiUrl}?days=${encodeURIComponent(days)}`;
    console.log("Fetching data from URL:", url); // URL'yi kontrol edelim
    const res = await fetch(url);

    if (!res.ok) {
      console.error('Response status:', res.status); // Yanıt durumunu kontrol et
      throw new Error('Network response was not ok');
    }

    const result = await res.json();
    console.log("API Response:", result); // API yanıtını konsolda yazdıralım
    return result;
  } catch (error) {
    console.error('Error fetching data:', error.message); // Hata mesajını daha detaylı yazdıralım
    throw new Error("Üzgünüm, verileri alırken bir hata oluştu.");
  }
};
