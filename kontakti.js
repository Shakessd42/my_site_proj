'use strict';

// НАСТРОЙКИ TELEGRAM
let TELEGRAM_BOT_TOKEN = '';
let TELEGRAM_CHAT_ID = '';

let form = document.querySelector('.feedback-form');

if (form) {
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        let name = form.querySelector('input[type="text"]').value;
        let phone = form.querySelector('input[type="tel"]').value;
        let email = form.querySelector('input[type="email"]').value;
        let message = form.querySelector('textarea').value;
        
        if (!name || !phone) {
            alert('Заполните имя и телефон');
            return;
        }
        
        let btn = form.querySelector('.form-submit');
        let originalText = btn.textContent;
        btn.textContent = 'Отправка...';
        btn.disabled = true;
        
        try {
            let telegramMessage = `
📩 НОВАЯ ЗАЯВКА С САЙТА

👤 Имя: ${name}
📞 Телефон: ${phone}
📧 Email: ${email}
💬 Сообщение: ${message}
            `;
            
            await sendToTelegram(telegramMessage);
            
            alert('Сообщение отправлено! Мы скоро свяжемся с вами.');
            form.reset();
            
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка отправки. Попробуйте позже.');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}

// отправка в Telegram
async function sendToTelegram(messageText) {
    try {
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: messageText,
                parse_mode: 'HTML'
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.warn('Telegram не отправил сообщение:', data);
        }
    } catch (error) {
        console.warn('Ошибка отправки в Telegram:', error);
    }
}