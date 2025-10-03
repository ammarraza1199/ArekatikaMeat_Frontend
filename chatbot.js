
document.addEventListener('DOMContentLoaded', () => {
    const chatbotIcon = document.querySelector('.chatbot-icon');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const closeBtn = document.querySelector('.chatbot-close');
    const sendBtn = document.querySelector('.chatbot-send');
    const chatInput = document.querySelector('.chatbot-input');
    const chatBody = document.querySelector('.chatbot-body');

    const responses = {
        'how to buy the leg piece': 'To buy a leg piece, go to the "Shop Now" page, find the "Leg Piece" product, and click "Add to Cart". Then, go to your cart and proceed to checkout.',
        'how to order': 'You can order by going to the "Shop Now" page, selecting the products you want, adding them to your cart, and then proceeding to checkout.',
        'what are your store hours': 'Our store hours are Mon-Sun: 6 AM - 10 PM.',
        'delivery options': 'We offer same-day delivery for orders placed before 2 PM.',
        'payment methods': 'We accept UPI and Cash on Delivery.',
        'return policy': 'We have a strict quality control process. If you are not satisfied with your order, please contact us within 24 hours for a resolution.',
        'contact information': 'You can reach us at arekatika@gmail.com or call us at +91 98765 43210.',
        'default': 'I\'m sorry, I don\'t understand. Can you please rephrase your question? You can ask me about how to order, our products, our store hours, delivery options, payment methods, return policy, or contact information.'
    };

    chatbotIcon.addEventListener('click', () => {
        chatbotWindow.style.display = 'flex';
        chatbotIcon.style.display = 'none';
        addMessage('bot', 'Hello! How can I help you today?');
    });

    closeBtn.addEventListener('click', () => {
        chatbotWindow.style.display = 'none';
        chatbotIcon.style.display = 'flex';
    });

    sendBtn.addEventListener('click', () => {
        const userInput = chatInput.value.trim();
        if (userInput) {
            addMessage('user', userInput);
            handleUserInput(userInput);
            chatInput.value = '';
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    async function getProducts() {
        try {
            const response = await fetch('backend/db.json');
            const data = await response.json();
            const products = data.products;
            let productMessage = 'Here are some of our products:\n';
            products.forEach(product => {
                productMessage += `- ${product.title}\n`;
            });
            addMessage('bot', productMessage);
        } catch (error) {
            console.error('Error fetching products:', error);
            addMessage('bot', 'Sorry, I am having trouble fetching the products right now.');
        }
    }

    async function getStores() {
        try {
            const response = await fetch('ourStores.html');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const storeCards = doc.querySelectorAll('.store-card-body');
            let storeMessage = 'Here are our store locations:\n';
            storeCards.forEach(card => {
                const title = card.querySelector('.store-card-title').textContent;
                const address = card.querySelector('.store-card-address').textContent;
                storeMessage += `- ${title}: ${address}\n`;
            });
            addMessage('bot', storeMessage);
        } catch (error) {
            console.error('Error fetching stores:', error);
            addMessage('bot', 'Sorry, I am having trouble fetching our store locations right now.');
        }
    }

    function handleUserInput(input) {
        const lowerCaseInput = input.toLowerCase();

        if (lowerCaseInput.includes('products') || lowerCaseInput.includes('product')) {
            getProducts();
            return;
        }

        if (lowerCaseInput.includes('shops') || lowerCaseInput.includes('stores') || lowerCaseInput.includes('locations')) {
            getStores();
            return;
        }

        let response = responses['default'];

        for (const key in responses) {
            if (lowerCaseInput.includes(key)) {
                response = responses[key];
                break;
            }
        }
        setTimeout(() => {
            addMessage('bot', response);
        }, 500);
    }

    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);
        messageElement.textContent = message;
        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
});
