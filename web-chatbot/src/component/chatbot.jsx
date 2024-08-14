import React, { useState } from 'react';
import '../chatbot.css'; // Stilleri buradan ekleyeceğiz

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');


  const apiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en';

  const fetchData = async (word) => {
    const url = `${apiUrl}/${encodeURIComponent(word)}`;
    console.log()
    try {
      const res = await fetch(url);
      const result = await res.json();
      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error("Üzgünüm, verileri alırken bir hata oluştu.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Kullanıcının mesajını ekleyin
    setMessages([...messages, { sender: 'user', text: input }]);



    
    // Basit bir yanıt simülasyonu
    setTimeout(async () => {
      var a=((await fetchData(input)));

      console.log(a[0].meanings[0].definitions[0].definition);
      setMessages([...messages, { sender: 'user', text: input }, { sender: 'bot', text: a[0].meanings[0].definitions[0].definition }]);
    }, 1000);

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
          placeholder="Mesajınızı yazın..."
        />
        <button type="submit">Gönder</button>
      </form>
    </div>
  );
}

export default Chatbot;
