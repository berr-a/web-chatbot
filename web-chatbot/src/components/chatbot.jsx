import React, { useState, useEffect } from 'react';
import '../chatbot.css';
import { fetchData, postData } from './api';

// Tavsiye ve uyarı metinlerini belirlemek için bir fonksiyon
const getAdviceAndAlert = (temperature) => {
  if (temperature >= 30) {
    return {
      alert: "Hava çok sıcak, bol su içmeyi unutmayın.",
      advice: "Hava bugün çok sıcak, şapka takmayı unutmayın."
    };
  } else if (temperature >= 20) {
    return {
      alert: "Hava sıcak, güneş koruyucu kullanın.",
      advice: "Güneşli bir gün, dışarıda vakit geçirebilirsiniz."
    };
  } else {
    return {
      alert: "Hava serin, uygun giyinin.",
      advice: "Serin hava için kalın giysiler giyin."
    };
  }
};

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newDay, setNewDay] = useState({
    date: '',
    temperatureC: '',
    summary: '',
    humidity: '',
    windSpeed: '',
    alert: '',
    advice: '',
  });
  const [days, setDays] = useState([1, 2, 3, 4, 5]);
  const [lastDay, setLastDay] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessages([...messages, { sender: 'user', text: input }]);

    try {
      const result = await fetchData(input);

      let botMessage;
      if (result && Array.isArray(result)) {
        botMessage = result.map((day, index) => {
          const { alert, advice } = getAdviceAndAlert(day.temperatureC);
          return (
            `Gün ${index + 1}:\n` +
            `Tarih: ${new Date(day.date).toLocaleDateString()}\n` +
            `Sıcaklık: ${day.temperatureC}°C\n` +
            `Özet: ${day.summary}\n` +
            `Nem: ${day.humidity}%\n` +
            `Rüzgar Hızı: ${day.windSpeed} km/s\n` +
            `Uyarı: ${day.alert || alert}\n` +
            `Tavsiye: ${day.advice || advice}\n` +
            `========================================================\n`
          );
        }).join('\n');
      } else {
        botMessage = "Yanıt bulunamadı veya beklenen formatta değil.";
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', text: input },
        { sender: 'bot', text: botMessage },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: "Üzgünüm, verileri alırken bir hata oluştu." },
      ]);
    }

    setInput('');
  };

  const handleAddDayClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDay({ ...newDay, [name]: value });
  };

  const handleSave = async () => {
    const newDayData = {
      Date: new Date(newDay.date).toISOString(),
      TemperatureC: parseInt(newDay.temperatureC, 10),
      Summary: newDay.summary || `Gün ${days.length + 1}`,
      Humidity: parseInt(newDay.humidity, 10),
      WindSpeed: parseInt(newDay.windSpeed, 10),
      Alert: newDay.alert || getAdviceAndAlert(parseInt(newDay.temperatureC, 10)).alert,
      Advice: newDay.advice || getAdviceAndAlert(parseInt(newDay.temperatureC, 10)).advice
    };

    try {
      await postData(newDayData);
      const newDaysList = [...days, days.length + 1];
      setDays(newDaysList);
      setLastDay(newDayData);  // Store the newly added day data
      setMessages([...messages, { sender: 'bot', text: `Yeni gün başarıyla eklendi: Gün ${newDaysList.length}` }]);
      handleModalClose();
    } catch (error) {
      console.error('Error saving new day:', error.message);
      setMessages([...messages, { sender: 'bot', text: 'Gün eklenirken bir hata oluştu.' }]);
    }
  };

  const handleDayClick = async (dayNumber) => {
    try {
      const result = await fetchData(dayNumber);

      let botMessage;
      if (result && Array.isArray(result)) {
        botMessage = result.map((day, index) => {
          const { alert, advice } = getAdviceAndAlert(day.temperatureC);
          return (
            `Gün ${index + 1}:\n` +
            `Tarih: ${new Date(day.date).toLocaleDateString()}\n` +
            `Sıcaklık: ${day.temperatureC}°C\n` +
            `Özet: ${day.summary}\n` +
            `Nem: ${day.humidity}%\n` +
            `Rüzgar Hızı: ${day.windSpeed} km/s\n` +
            `Uyarı: ${day.alert || alert}\n` +
            `Tavsiye: ${day.advice || advice}\n` +
            `========================================================\n`
          );
        }).join('\n');
      } else {
        botMessage = "Yanıt bulunamadı veya beklenen formatta değil.";
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: botMessage },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: "Üzgünüm, verileri alırken bir hata oluştu." },
      ]);
    }
  };

  useEffect(() => {
    if (lastDay) {
      const message = `Gün ${days.length} (Yeni Eklendi):\n` +
        `Tarih: ${new Date(lastDay.Date).toLocaleDateString()}\n` +
        `Sıcaklık: ${lastDay.TemperatureC}°C\n` +
        `Özet: ${lastDay.Summary}\n` +
        `Nem: ${lastDay.Humidity}%\n` +
        `Rüzgar Hızı: ${lastDay.WindSpeed} km/s\n` +
        `Uyarı: ${lastDay.Alert || 'Yok'}\n` +
        `Tavsiye: ${lastDay.Advice || 'Yok'}`;
      
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: message },
      ]);
      setLastDay(null); // Reset the last day after showing the message
    }
  }, [lastDay, days.length]);

  return (
    <div className="container">
      <div className="day-list">
        {days.map((day) => (
          <button key={day} className="day-item" onClick={() => handleDayClick(day)}>
            Gün {day}
          </button>
        ))}
        <button className="add-day-button" onClick={handleAddDayClick}>
          Ekle
        </button>
      </div>
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
            placeholder="Bir gün sayısı giriniz..."
          />
          <button type="submit">Gönder</button>
        </form>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Yeni Gün Ekle</h2>
            <label>
              Tarih:
              <input
                type="date"
                name="date"
                value={newDay.date}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Sıcaklık (°C):
              <input
                type="number"
                name="temperatureC"
                value={newDay.temperatureC}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Özet:
              <input
                type="text"
                name="summary"
                value={newDay.summary}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Nem Oranı (%):
              <input
                type="number"
                name="humidity"
                value={newDay.humidity}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Rüzgar Hızı (km/s):
              <input
                type="number"
                name="windSpeed"
                value={newDay.windSpeed}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Uyarı:
              <input
                type="text"
                name="alert"
                value={newDay.alert}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Tavsiye:
              <input
                type="text"
                name="advice"
                value={newDay.advice}
                onChange={handleInputChange}
              />
            </label>
            <button onClick={handleSave}>Kaydet</button>
            <button onClick={handleModalClose}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
