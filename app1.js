'use strict';

let cartButton = document.getElementById('cart');
let countElement = document.querySelector('.count');
let addButtons = document.querySelectorAll('.cart-add-btn');
let cartPanel = document.querySelector('.cart-panel');
let overlay = document.querySelector('.overlay');
let closeCartButton = document.querySelector('.close-cart');
let cartItemsContainer = document.querySelector('.cart-items');
let totalPriceElement = document.getElementById('totalPrice');
let buyBtn = document.getElementById('buyBtn');
let cartItems = [];

try {
    let savedCart = localStorage.getItem('z-motors-cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
    }
} catch (e) {
    cartItems = [];
}

// 1. Сохраняем корзину в память браузера
function saveCartToStorage() {
    try {
        localStorage.setItem('z-motors-cart', JSON.stringify(cartItems));
    } catch (e) {
        console.log('Не удалось сохранить корзину');
    }
}

function updateCart() {
    // Обновляем счетчик
    countElement.textContent = cartItems.length;
    
    // Обновляем отображение товаров
    updateCartDisplay();
    
    // Обновляем кнопки добавить в корзину
    updateButtons();
    
    // Обновляем общую сумму
    updateTotalPrice();
}

//  показ товаров в корзине
function updateCartDisplay() {
    // Очищаем корзину
    cartItemsContainer.innerHTML = '';
    
    // Если корзина пустая
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
        return;
    }
    
    // Добавляем каждый товар
    for (let i = 0; i < cartItems.length; i++) {
        let item = cartItems[i];
        
        // блок товара
        let itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <p><b>${item.name}</b></p>
            <p>${item.price} ₽</p>
            <button class="remove-item" data-index="${i}">Удалить</button>`;
        
        cartItemsContainer.append(itemDiv);
    }
    
    // обработчики для кнопок удаления
    let removeButtons = document.querySelectorAll('.remove-item');
    for (let j = 0; j < removeButtons.length; j++) {
        removeButtons[j].addEventListener('click', function() {
            let index = this.getAttribute('data-index');
            removeFromCart(index);
        });
    }
}

// Удаление товара из корзины
function removeFromCart(index) {
    cartItems.splice(index, 1);
    updateCart();
}

// Обновление кнопок добавить в корзину
function updateButtons() {
    for (let k = 0; k < addButtons.length; k++) {
        let button = addButtons[k];
        let card = button.closest('.product-card');
        let productName = card.querySelector('.product-name').textContent;
        
        // Проверяем есть ли товар в корзине
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

// Подсчет общей суммы
function updateTotalPrice() {
    let total = 0;
    
    // Считаем сумму всех товаров
    for (let i = 0; i < cartItems.length; i++) {
        total += cartItems[i].price;
    }
    
    totalPriceElement.textContent = total + ' ₽';
    
    // Включаем/выключаем кнопку купить
    if (cartItems.length === 0) {
        buyBtn.disabled = true;
    } else {
        buyBtn.disabled = false;
    }
}

// Открытие/закрытие корзины
function openCart() {
    cartPanel.classList.add('open');
    overlay.classList.add('active');
}

function closeCart() {
    cartPanel.classList.remove('open');
    overlay.classList.remove('active');
}

// Обработчик для добавить в корзину
for (let index = 0; index < addButtons.length; index++) {
    addButtons[index].addEventListener('click', function() {
        let card = this.closest('.product-card');
        let productName = card.querySelector('.product-name').textContent;
        
        // цены по порядку товаров
        let prices = [330182, 431990, 419990, 289990, 161990, 169990, 139490];
        let price = prices[index];
        
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

// Покупка
buyBtn.addEventListener('click', function() {
    if (cartItems.length === 0) return;
    alert('Спасибо за покупку! Ваш заказ оформлен. С вами свяжется менеджер.');
    cartItems = [];
    updateCart();
    closeCart();
});

cartButton.addEventListener('click', openCart);
closeCartButton.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

updateCart();