const apiUrl = 'http://localhost:50937/Weather';

// Verileri almak için kullanılan fonksiyon
export const fetchData = async (days) => {
  try {
    const url = `${apiUrl}?days=${encodeURIComponent(days)}`;
    console.log("Fetching data from URL:", url);
    const res = await fetch(url);

    if (!res.ok) {
      console.error('Response status:', res.status);
      throw new Error('Network response was not ok');
    }

    const result = await res.json();
    console.log("API Response:", result);
    return result;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw new Error("Üzgünüm, verileri alırken bir hata oluştu.");
  }
};

// Yeni bir günü eklemek için kullanılan fonksiyon
export const postData = async (day) => {
  try {
    const url = `${apiUrl}/addDay`; // Endpoint'i doğru şekilde ayarla
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(day),
    });

    if (!res.ok) {
      console.error('Response status:', res.status);
      throw new Error('Network response was not ok');
    }

    const result = await res.json();
    console.log("API Response:", result);
    return result;
  } catch (error) {
    console.error('Error posting data:', error.message);
    throw new Error("Üzgünüm, veriyi kaydederken bir hata oluştu.");
  }
};
