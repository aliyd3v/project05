(function () {
    "use strict";

    let cartContainer = document.getElementById('cart-container');
    let emptyMessage = document.getElementById('empty-message');
    let containerOrdering = document.getElementById('container-ordering');
    let orderButton = document.getElementById('order-button');

    emptyMessage.style.display = 'none';
    containerOrdering.style.display = 'none';
    orderButton.style.display = 'none';

    let localStorageKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).includes('cart-item')) {
            localStorageKeys.push(localStorage.key(i));
        };
    };
    if (localStorageKeys.length == 0) {
        emptyMessage.style.display = 'none';
    };

})()