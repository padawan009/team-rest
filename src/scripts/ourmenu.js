import "../style/ourmenu.css";

import createHeader, { updateBasketBtnDisplay } from './header.js';

const myMenu = [];
const myOrder = [];

export function basketBtnClick() {
    if (myOrder.length > 0) {
        orderItemContainer.classList.toggle('active'); 
    }
    else
    alert('Add some positions to your order!');
}

createHeader(basketBtnClick);

const mainMenu = document.createElement('main');
mainMenu.classList.add('main-ourmenu');

const h2Menu = document.createElement('h2');
h2Menu.classList.add('ourmenu-title');
h2Menu.textContent = 'Our Best & Delicious Menu';

const menuContainer = document.createElement('div');
menuContainer.classList.add('menu-container');

function Menu (name, description, price) {
    this.name = name;
    this.description = description;
    this.price = price;
}

const menu1 = new Menu('Naan Burger', 'Juicy grilled patty, fresh veggies, and sauces in warm naan bread.', '$1.85');
const menu2 = new Menu('Butter Chicken Taco', 'Tender chicken in creamy butter sauce, wrapped in a soft taco shell.', '$1.15');
const menu3 = new Menu('Chicken Burger', 'Crispy chicken patty, fresh lettuce, tomato, and savory sauce in a soft bun.', '$2.00');
const menu4 = new Menu('Cheese Chicken Naan','Juicy chicken, melted cheese, and flavorful spices wrapped in warm, soft naan bread.', '$2.50');
const menu5 = new Menu('3 Layer Burger', 'Three juicy beef patties, fresh veggies, cheese, and creamy sauce in a hearty bun.', '$4.99');
const menu6 = new Menu('Sandwich', 'Fresh bread filled with your choice of meats, cheese, veggies, and tasty condiments.', '$2.80');

myMenu.push(menu1, menu2, menu3, menu4, menu5, menu6);


// создаем карточки меню 

myMenu.forEach((item, index) => {
    const menuItem = document.createElement('div');
    menuItem.classList.add('menu-item');
    menuItem.setAttribute('id', `item-${index + 1}`);

    const itemImg = document.createElement('img');
    itemImg.classList.add('menu-image');
    itemImg.setAttribute('src', importImg(index + 1));
    itemImg.setAttribute('height', '200px');

    const itemName = document.createElement('p');
    itemName.classList.add('menu-name');
    itemName.textContent = item.name;

    const itemDesc = document.createElement('p');
    itemDesc.classList.add('menu-description');
    itemDesc.textContent = item.description;

    const itemPriceBlock = document.createElement('div');
    itemPriceBlock.classList.add('price-block');

    const itemPrice = document.createElement('p');
    itemPrice.classList.add('menu-price');
    itemPrice.textContent = item.price;

    const itemAmountContainer = document.createElement('div');
    itemAmountContainer.classList.add('price-block__amount-container');

    const itemAmount = createItemAmount();
    const itemAmountDecrease = createItemAmountDecrease(itemAmount);
    const itemAmountIncrease = createItemAmountIncrease(itemAmount);

    const itemAmountBtns = document.createElement('div');
    itemAmountBtns.classList.add('price-block__amount-btns');

    itemAmountBtns.appendChild(itemAmountDecrease);
    itemAmountBtns.appendChild(itemAmount);
    itemAmountBtns.appendChild(itemAmountIncrease);

    itemAmountContainer.appendChild(itemAmountBtns);

    itemAmountDecrease.addEventListener('click', () => {
        if (itemAmount.value > 0) {
            itemAmount.value--;
        }
    });

    itemAmountIncrease.addEventListener('click', () => {
        itemAmount.value++;
        if (itemAmount.value > 50) {
            itemAmount.value = 50;
            alert('You can order no more than 50 servings!');
        }
    });

    const itemBasketBtn = document.createElement('button');
    itemBasketBtn.classList.add('basket-btn');

    const itemBasket = document.createElement('img');
    itemBasket.classList.add('basket-icon');
    itemBasket.setAttribute('src', require('../icons/basket-btn.svg'));

    itemBasketBtn.addEventListener('click', () => {
        let itemAmountValue = itemAmount.value;
        if (itemAmountValue > 0) {
            itemBasketBtn.style.backgroundColor = 'rgba(136, 9, 9, 0.87)';
            changeItemBasketStyle(itemBasket);
            addMyOrderItem(item.name, itemAmountValue, item.price);
            itemAmountValue = 0;
        }
        saveToLocalStorage();
        
    });

    itemBasketBtn.appendChild(itemBasket);
    itemAmountContainer.appendChild(itemBasketBtn);

    itemPriceBlock.appendChild(itemPrice);
    itemPriceBlock.appendChild(itemAmountContainer);

    menuItem.appendChild(itemImg);
    menuItem.appendChild(itemName);
    menuItem.appendChild(itemDesc);
    menuItem.appendChild(itemPriceBlock);
    menuContainer.appendChild(menuItem);
});

function importImg(itemPosition) {
    const itemImgSrc = require(`../icons/item-${itemPosition}.png`);
    return itemImgSrc;
}

function createItemAmount() {
    const itemAmount = document.createElement('input');
    itemAmount.classList.add('price-block__amount');
    itemAmount.setAttribute('type', 'number');
    itemAmount.setAttribute('value', '0');
    itemAmount.setAttribute('onkeydown', 'return false');
    return itemAmount;
}

function createItemAmountDecrease(itemAmount) {    
    const itemAmountDecrease = document.createElement('button');
    itemAmountDecrease.classList.add('price-block__amount-btn-decrease');
    itemAmountDecrease.textContent = '-';
    return itemAmountDecrease;
}

function createItemAmountIncrease(itemAmount) {
    const itemAmountIncrease = document.createElement('button');
    itemAmountIncrease.classList.add('price-block__amount-btn-increase');
    itemAmountIncrease.textContent = '+';
    return itemAmountIncrease;
}

mainMenu.appendChild(h2Menu);
mainMenu.appendChild(menuContainer);
document.body.appendChild(mainMenu);

// создаем корзину и ее содержимое

function Order (name, value, price) {
    this.name = name;
    this.value = value;
    this.price = price;
}

function addMyOrderItem(name, value, price) {
    const orderItem = new Order(name, value, price);
    const uniqueOrderItem = myOrder.find(orderItem => orderItem.name === name);
    if (uniqueOrderItem) {
        uniqueOrderItem.value = +uniqueOrderItem.value + +value;
        upadetOrderItemValue(uniqueOrderItem, value);
    }
    else {
        myOrder.push(orderItem);
        saveToLocalStorage();
        createBasketOrder(orderItem);
    }
    updateBasketBtnDisplay(myOrder.length); // добавляем позиции в корзину в header
    console.table(myOrder);
}

function upadetOrderItemValue(uniqueOrderItem, value) {
    const orderItems = document.querySelectorAll('.order-item');
    const index = myOrder.indexOf(uniqueOrderItem);

    const orderItemAmount = orderItems[index].querySelector('.order-item__amount');
    const orderItemTotalPrice = orderItems[index].querySelector('.order-item__total-price');
    
    if (uniqueOrderItem.value <= 50) {
        orderItemAmount.value = uniqueOrderItem.value;
        orderItemTotalPrice.textContent = `$${(+uniqueOrderItem.price.slice(1) * uniqueOrderItem.value).toFixed(2)}`;
        updateOrderTotalValue();
    }
    else if (uniqueOrderItem.value > 50) {
        alert('You can order no more than 50 servings of the same dish!');
        uniqueOrderItem.value -= value;
    }
}

// создаем корзину 

const orderItemContainer = document.createElement('div');  // контейнер для заказа
orderItemContainer.classList.add('order-item-container');
orderItemContainer.textContent = 'Your order:';

const orderTotalValue = document.createElement('div');
orderTotalValue.classList.add('order-total-value');

const cleanBasketBtn = document.createElement('button');  // кнопка очистки корзины
cleanBasketBtn.classList.add('clean-basketBtn');
cleanBasketBtn.textContent = 'Clean';

cleanBasketBtn.addEventListener('click', () => {
    myOrder.length = 0;  
    localStorage.clear();
    document.querySelector('.order-item-container').innerHTML = 'Your order:';  // удаляем содержимое контейнера из DOM
    orderItemContainer.classList.toggle('active'); 
    updateBasketBtnDisplay(0); 
});

const orderTotalValueText = document.createElement('p');
orderTotalValueText.classList.add('order-total-value__text');
orderTotalValue.appendChild(cleanBasketBtn);
orderTotalValue.appendChild(orderTotalValueText);

// функция для создания карточек заказа в корзину

export function createBasketOrder(item) {
    const orderItem = document.createElement('div');
    orderItem.classList.add('order-item');

    // const orderPosition = document.createElement('p');    // позиция в заказе ? нужна ли
    // orderPosition.classList.add('order-item__position');
    // orderPosition.textContent = `${myOrder.indexOf(item) + 1}.`;

    const orderItemBlock = document.createElement('div');
    orderItemBlock.classList.add('order-item__block');

    const orderItemName = document.createElement('p');
    orderItemName.classList.add('order-item__name');
    orderItemName.textContent = item.name;

    const orderItemPrice = document.createElement('p');
    orderItemPrice.classList.add('order-item__price');
    orderItemPrice.textContent = item.price;

    orderItemBlock.appendChild(orderItemName);
    orderItemBlock.appendChild(orderItemPrice);


    const orderItemAmount = document.createElement('input');
    orderItemAmount.classList.add('order-item__amount');
    orderItemAmount.value = item.value;
    console.log(orderItemAmount.value);

    const orderItemDecrease = createItemAmountDecrease(orderItemAmount);
    const orderItemIncrease = createItemAmountIncrease(orderItemAmount);

    orderItemDecrease.addEventListener('click', () => {
        if (orderItemAmount.value > 1) {
            orderItemAmount.value--;
            myOrder[myOrder.indexOf(item)].value = orderItemAmount.value;  // обновляем значение количества в массиве
            updateTotalPrice();
            saveToLocalStorage();
            console.log(myOrder);
        }
        else {
            orderItem.remove();
            myOrder.splice(myOrder.indexOf(item), 1); // удаляем позицую из массива по индексу
            updateBasketBtnDisplay(myOrder.length);  // удаляем позиции из корзины в header
            saveToLocalStorage();
        }
        updateOrderTotalValue();
    });

    orderItemIncrease.addEventListener('click', () => {
        if (orderItemAmount.value < 50) {
            orderItemAmount.value++;
            myOrder[myOrder.indexOf(item)].value = orderItemAmount.value;
            updateTotalPrice();
            saveToLocalStorage();
            console.log(myOrder);
        } else {
            alert('You can order no more than 50 serivngs of the same dish!');
        }
        updateOrderTotalValue();
    });

    const orderItemTotalPrice = document.createElement('p');
    orderItemTotalPrice.classList.add('order-item__total-price');
    orderItemTotalPrice.textContent = `$${(+item.price.slice(1) * +orderItemAmount.value).toFixed(2)}`;
  
    // функция для подсчета итоговой стоимости позиции
    function updateTotalPrice() {
        orderItemTotalPrice.textContent = `$${(+item.price.slice(1) * +orderItemAmount.value).toFixed(2)}`;
    }

    const orderItemTotalBlock = document.createElement('div');
    orderItemTotalBlock.classList.add('order-item__total-block');
    orderItemTotalBlock.appendChild(orderItemAmount);
    orderItemTotalBlock.appendChild(orderItemTotalPrice);

    const orderItemTotalContainer = document.createElement('div');
    orderItemTotalContainer.classList.add('order-item__total-container');   
    orderItemTotalContainer.appendChild(orderItemDecrease);
    orderItemTotalContainer.appendChild(orderItemTotalBlock);   
    orderItemTotalContainer.appendChild(orderItemIncrease);
  
    orderItem.appendChild(orderItemBlock);
    orderItem.appendChild(orderItemTotalContainer);
    orderItemContainer.appendChild(orderItem);
    orderItemContainer.appendChild(orderTotalValue);

    updateOrderTotalValue();

}

mainMenu.appendChild(orderItemContainer);

 // функция для подсчета итоговой стоимости всего заказа
function updateOrderTotalValue() {  
    let totalValue = myOrder.reduce((sum, item) => sum + (+item.price.slice(1) * item.value), 0);
    orderTotalValueText.textContent = `Total: $${totalValue.toFixed(2)}`;
}

// меняет стиль иконки после нажатия на кнопку
function changeItemBasketStyle(itemBasket) {
    itemBasket.style.transform = 'scale(1.1)';
    itemBasket.style.filter = 'drop-shadow(0px 0px 3px#ffffff)';
}


// localstorage
function saveToLocalStorage() {
    localStorage.setItem('myOrder', JSON.stringify(myOrder));
}

function loadFromLocalStorage() {
    const savedLocal = JSON.parse(localStorage.getItem('myOrder'));
    if (savedLocal) {
        myOrder.push(...savedLocal);
        console.log(myOrder.length);
        myOrder.forEach(createBasketOrder); 
        updateBasketBtnDisplay(myOrder.length);
        updateOrderTotalValue();
    }
}

loadFromLocalStorage();
