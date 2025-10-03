
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const API_URL = 'http://localhost:5000/api'; // Assuming a chatbot API endpoint

  const responses: { [key: string]: string } = {
    'how to buy the leg piece': 'To buy a leg piece, go to the "Shop Now" page, find the "Leg Piece" product, and click "Add to Cart". Then, go to your cart and proceed to checkout.',
    'how to order': 'You can order by going to the "Shop Now" page, selecting the products you want, adding them to your cart, and then proceeding to checkout.',
    'what are your store hours': 'Our store hours are Mon-Sun: 6 AM - 10 PM.',
    'default': 'I\'m sorry, I don\'t understand. Can you please rephrase your question? You can ask me about how to order, our products, or our store hours.'
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      addMessage('bot', 'Hello! How can I help you today?');
    }
  };

  const addMessage = (sender: 'user' | 'bot', text: string) => {
    setMessages((prevMessages) => [...prevMessages, { sender, text }]);
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    addMessage('user', input);
    const lowerCaseInput = input.toLowerCase();
    setInput('');

    if (lowerCaseInput.includes('products') || lowerCaseInput.includes('product')) {
      await getProducts();
      return;
    }

    if (lowerCaseInput.includes('shops') || lowerCaseInput.includes('stores') || lowerCaseInput.includes('locations')) {
      await getStores();
      return;
    }

    let botResponse = responses[lowerCaseInput] || responses['default'];
    setTimeout(() => {
      addMessage('bot', botResponse);
    }, 500);
  };

  const getProducts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/products`);
      let productMessage = 'Here are some of our products:\n';
      data.forEach((product: any) => {
        productMessage += `- ${product.title}\n`;
      });
      addMessage('bot', productMessage);
    } catch (error) {
      console.error('Error fetching products:', error);
      addMessage('bot', 'Sorry, I am having trouble fetching the products right now.');
    }
  };

  const getStores = async () => {
    try {
      // For now, hardcode store data as there is no backend API for stores
      const storeData = [
        { title: 'Miyapur', address: 'Miyapur Rd, Miyapur, Hyderabad, Telangana 500049' },
        { title: 'Khairtabad', address: 'Khairtabad, Hyderabad, Telangana 500004' },
        { title: 'Nampally', address: 'Nampally, Hyderabad, Telangana 500001' },
      ];
      let storeMessage = 'Here are our store locations:\n';
      storeData.forEach(store => {
        storeMessage += `- ${store.title}: ${store.address}\n`;
      });
      addMessage('bot', storeMessage);
    } catch (error) {
      console.error('Error fetching stores:', error);
      addMessage('bot', 'Sorry, I am having trouble fetching our store locations right now.');
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-icon" onClick={toggleChatbot}>
        <i className="bi bi-chat-dots"></i>
      </div>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h5>AreKatika Chat</h5>
            <span className="chatbot-close" onClick={toggleChatbot}>&times;</span>
          </div>
          <div className="chatbot-body" ref={chatBodyRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}-message`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-footer">
            <input
              type="text"
              className="chatbot-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="chatbot-send" onClick={handleSend}>
              <i className="bi bi-send"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
