import React, { useState } from 'react';
import '../chatbot.css'; // Stilleri buradan ekleyeceğiz
import { fetchData } from './api'; // fetchData fonksiyonunu buradan içe aktarıyoruz

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Kullanıcının mesajını ekleyin
    setMessages([...messages, { sender: 'user', text: input }]);

    try {
      // API'den yanıt alın
      const result = await fetchData(input);

      // Yanıtı işleyin ve mesajlara ekleyin
      let botMessage;
      if (result && Array.isArray(result)) {
        botMessage = result.map((day, index) => 
          `Gün ${index + 1}:\n` +
          `Tarih: ${new Date(day.date).toLocaleDateString()}\n` +
          `Sıcaklık: ${day.temperatureC}°C\n` +
          `Özet: ${day.summary}\n` +
          `Simge: ${day.icon}\n` +
          `Nem: ${day.humidity}%\n` +
          `Rüzgar Hızı: ${day.windSpeed} km/s\n` +
          `Uyarı: ${day.alert || 'Yok'}\n` +
          `Tavsiye: ${day.advice || 'Yok'}\n` +
          `================================================\n` // Ayrı bir çizgi
        ).join('\n');
      } else {
        botMessage = "Yanıt bulunamadı veya beklenen formatta değil.";
      }
      
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', text: input },
        { sender: 'bot', text: botMessage },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error.message); // Hata mesajını yazdıralım
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: "Üzgünüm, verileri alırken bir hata oluştu." },
      ]);
    }

    setInput('');
  };

  return (
    <div className="chatbot">
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <form className="chatbot-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="1 ile 5 arasında bir sayı giriniz..."
        />
        <button type="submit">Gönder</button>
      </form>
    </div>
  );
}

export default Chatbot;
