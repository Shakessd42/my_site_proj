'use strict';

// Находим элементы
let cartButton = document.getElementById('cart');
let countElement = document.querySelector('.count');
let addButtons = document.querySelectorAll('.cart-add-btn');
let cartPanel = document.querySelector('.cart-panel');
let overlay = document.querySelector('.overlay');
let closeCartButton = document.querySelector('.close-cart');
let cartItemsContainer = document.querySelector('.cart-items');
let totalPriceElement = document.getElementById('totalPrice');
let buyBtn = document.getElementById('buyBtn');

// Цены товаров
let prices = [330182, 431990, 419990, 289990, 161990, 169990, 139490];

// Загружаем корзину из localStorage или создаем пустую
let cartItems = loadCartFromStorage();

//  Загружаем корзину из памяти браузера
function loadCartFromStorage() {
    try {
        let saved = localStorage.getItem('motors-cart');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (err) {
        console.log('Не смогли загрузить корзину');
    }
    return [];
}

//  Сохраняем корзину в память браузера
function saveCartToStorage() {
    try {
        localStorage.setItem('motors-cart', JSON.stringify(cartItems));
    } catch (err) {
        console.log('Не смогли сохранить корзину');
    }
}

//  Обновляем корзину
function updateCart() {
    countElement.textContent = cartItems.length; // Обновляем счетчик
    updateCartDisplay(); // Показываем товары
    updateButtons(); // Меняем кнопки
    updateTotalPrice(); // Считаем сумму
    saveCartToStorage(); // Сохраняем в память
}

//  Показать товары в корзине
function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
        return;
    }
    
    for (let i = 0; i < cartItems.length; i++) {
        let item = cartItems[i];
        
        let itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <p><b>${item.name}</b></p>
            <p>${item.price} ₽</p>
            <button class="remove-item" data-index="${i}">Удалить</button>
        `;
        
        cartItemsContainer.append(itemDiv);
    }
    
    //обработчики на кнопки удаления
    let removeButtons = document.querySelectorAll('.remove-item');
    for (let i = 0; i < removeButtons.length; i++) {
        removeButtons[i].addEventListener('click', function() {
            let index = this.getAttribute('data-index');
            removeFromCart(index);
        });
    }
}

// Удалить товар из корзины
function removeFromCart(index) {
    cartItems.splice(index, 1);
    updateCart();
}

//  Обновить кнопки добавить в корзину
function updateButtons() {
    for (let j = 0; j < addButtons.length; j++) {
        let button = addButtons[j];
        let card = button.closest('.product-card');
        let productName = card.querySelector('.product-name').textContent;
        
        let found = false;
        for (let i = 0; i < cartItems.length; i++) {
            if (cartItems[i].name === productName) {
                found = true;
                break;
            }
        }
        
        if (found) {
            button.textContent = 'убрать из корзины';
            button.classList.add('added');
        } else {
            button.textContent = 'добавить в корзину';
            button.classList.remove('added');
        }
    }
}

// Подсчитать сумму
function updateTotalPrice() {
    let total = 0;
    
    for (let i = 0; i < cartItems.length; i++) {
        total += cartItems[i].price;
    }
    
    totalPriceElement.textContent = total + ' ₽';
    
    if (cartItems.length === 0) {
        buyBtn.disabled = true;
    } else {
        buyBtn.disabled = false;
    }
}

// открыть корзину
function openCart() {
    cartPanel.classList.add('open');
    overlay.classList.add('active');
}
// закрыть корзину
function closeCart() {
    cartPanel.classList.remove('open');
    overlay.classList.remove('active');
}

//  обработчик кнопок добавить в корзину
for (let j = 0; j < addButtons.length; j++) {
    addButtons[j].addEventListener('click', function() {
        let card = this.closest('.product-card');
        let productName = card.querySelector('.product-name').textContent;
        
        let price = prices[j] || 0;
        
        if (this.textContent === 'добавить в корзину') {
            cartItems.push({
                name: productName,
                price: price
            });
        } else {
            for (let i = 0; i < cartItems.length; i++) {
                if (cartItems[i].name === productName) {
                    cartItems.splice(i, 1);
                    break;
                }
            }
        }
        
        updateCart();
    });
}

//  Покупка
buyBtn.addEventListener('click', function() {
    if (cartItems.length === 0) return;
    
    alert('Спасибо за покупку! Ваш заказ оформлен. С вами свяжется менеджер.');
    
    // Очищаем корзину и localStorage
    cartItems = [];
    localStorage.removeItem('motors-cart');
    updateCart();
    
    closeCart();
});

// Обработчики событий
cartButton.addEventListener('click', openCart); // Клик по иконке корзины
closeCartButton.addEventListener('click', closeCart); // Клик по крестику
overlay.addEventListener('click', closeCart); // Клик по темному фону

updateCart();