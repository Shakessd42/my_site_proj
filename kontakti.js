'use strict';

const API_URL = "";

let form = document.querySelector('form'); 

if (form) {
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // данные из формы
        let formData = {
            name: form.querySelector('input[type="text"]').value,
            phone: form.querySelector('input[type="tel"]').value,
            email: form.querySelector('input[type="email"]').value,
            message: form.querySelector('textarea').value
        };

        if (!formData.name || !formData.phone) {
            alert('Заполните имя и телефон');
            return;
        }

        let btn = form.querySelector('.form-submit');
        let originalText = btn.textContent;
        btn.textContent = 'Отправка...';
        btn.disabled = true;

        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(function (response) {
            if (response.status === 201) {
                console.log("Данные успешно отправлены");
                return response.json();
            } else {
                console.log("Ошибка " + response.status);
                throw new Error('Ошибка сервера: ' + response.status);
            }
        })
        .then(function (data) {
            console.log(data);
            alert('Сообщение отправлено!');
            form.reset();
        })
        .catch(function(err){
            console.log("Ошибка Соединения", err);
            alert('Ошибка отправки. Попробуйте позже.');
        })
        .finally(function(){
            btn.textContent = originalText;
            btn.disabled = false;
        });
    });
}