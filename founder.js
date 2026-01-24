'use strict';

// Находим элементы
let budgetInput = document.getElementById('budgetInput');
let applyButton = document.getElementById('applyBudget');
let resetButton = document.getElementById('resetBudget');
let message = document.getElementById('budgetMessage');
let count = document.getElementById('foundCount');
let totalSpan = document.getElementById('totalCount');


// Цены мотоциклов
let moto_prices = [330182, 431990, 419990, 289990, 161990, 169990, 139490];
let allCards = document.querySelectorAll('.product-card');

// Общее количество
let total = allCards.length;
totalSpan.textContent = total;

// Загружаем сохраненный бюджет
function loadBudget() {
    let saved = localStorage.getItem('moto-budget');
    if (saved) {
        return parseInt(saved);
    }
    return 500000; // по умолчанию
}

// Сохраняем бюджет
function saveBudget(budget) {
    localStorage.setItem('moto-budget', budget);
}

// Фильтруем товары
function filterProducts(budget) {
    let found = 0;
    
    for (let i = 0; i < allCards.length; i++) {
        if (moto_prices[i] <= budget) {
            allCards[i].style.display = 'block';
            found++;
        } else {
            allCards[i].style.display = 'none';
        }
    }
    
    count.textContent = found;
    
    let formatted = budget.toLocaleString('ru-RU') + ' ₽';
    if (found === 0) {
        message.textContent = 'Нет мотоциклов до ' + formatted;
        message.style.color = 'red';
    } else {
        message.textContent = 'Найдено ' + found + ' мотоциклов до ' + formatted;
        message.style.color = '#3498db';
    }
    
    return found;
}

// Кнопка "Применить"
applyButton.addEventListener('click', function() {
    let budget = parseInt(budgetInput.value);
    
    if (budget < 100000) {
        budget = 100000;
        budgetInput.value = budget;
    }
    
    if (budget > 500000) {
        budget = 500000;
        budgetInput.value = budget;
    }
    
    // Фильтруем и сохраняем
    filterProducts(budget);
    saveBudget(budget);
    
});

// Кнопка Сбросить
resetButton.addEventListener('click', function() {
    budgetInput.value = 500000;
    
    for (let i = 0; i < allCards.length; i++) {
        allCards[i].style.display = 'block';
    }
    
    count.textContent = total;
    message.textContent = 'Показаны все мотоциклы';
    message.style.color = 'green';
    
    localStorage.removeItem('moto-budget');
    
});

// При загрузке страницы применяем сохраненный фильтр
window.addEventListener('load', function() {
    let savedBudget = loadBudget();
    budgetInput.value = savedBudget;
    filterProducts(savedBudget);
});