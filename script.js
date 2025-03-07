document.addEventListener("DOMContentLoaded", function () {
    document.querySelector('.category-ntd').onclick = () => location.href = 'Nintendo.html';
    document.querySelector('.category-xb').onclick = () => location.href = 'Xbox.html';
    document.querySelector('.category-ps4').onclick = () => location.href = 'PlayStation4.html';
    document.querySelector('.category-ps5').onclick = () => location.href = 'PlayStation5.html';
    document.querySelector('.category-sir').onclick = () => location.href = 'GamesSir.html';
});

let basketCount = 0;
const basketCountElement = document.getElementById("basket-count");

function updateBasket() {
    basketCount++;
    basketCountElement.textContent = basketCount;

    if (basketCount > 0) {
        basketCountElement.style.display = "inline-block";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("basket").addEventListener("click", function(event) {
        event.preventDefault();
        updateBasket();
    });
});
