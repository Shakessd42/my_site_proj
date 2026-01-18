'use strict';

const cartButton = document.getElementById('cart');
const countElement = document.querySelector('.count');
const addButtons = document.querySelectorAll('.cart-add-btn');

let cartItems = [];

const cartPanel = document.querySelector('.cart-panel');
const overlay = document.querySelector('.overlay');
const closeCartButton = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');

function updateCart() {
    countElement.textContent = cartItems.length;
    updateCartDisplay();
    updateButtons();
}

function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
        return;
    }
    
    cartItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <p><strong>${item.name}</strong></p>
            <p>${item.price.toLocaleString('ru-RU')} ₽</p>
            <button class="remove-item" data-index="${index}">Удалить</button>
        `;
        cartItemsContainer.appendChild(div);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cartItems.splice(index, 1);
            updateCart();
        });
    });
}

function updateButtons() {
    addButtons.forEach(button => {
        const card = button.closest('.product-card');
        const productName = card.querySelector('.product-name').textContent;
        
        const isInCart = cartItems.some(item => item.name === productName);
        
        if (isInCart) {
            button.textContent = 'убрать из корзины';
            button.classList.add('added');
        } else {
            button.textContent = 'добавить в корзину';
            button.classList.remove('added');
        }
    });
}

function openCart() {
    cartPanel.classList.add('open');
    overlay.classList.add('active');
}

function closeCart() {
    cartPanel.classList.remove('open');
    overlay.classList.remove('active');
}

cartButton.addEventListener('click', openCart);
closeCartButton.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

addButtons.forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.product-card');
        const productName = card.querySelector('.product-name').textContent;
        const priceText = card.querySelector('.product-price').textContent;
        const priceMatch = priceText.match(/\d[\d\s]*\d/);
        const price = priceMatch ? parseInt(priceMatch[0].replace(/\s+/g, '')) : 0;
        
        if (this.textContent === 'добавить в корзину') {
            cartItems.push({
                name: productName,
                price: price
            });
        } else {
            const index = cartItems.findIndex(item => item.name === productName);
            if (index !== -1) {
                cartItems.splice(index, 1);
            }
        }
        
        updateCart();
    });
});

updateCart();