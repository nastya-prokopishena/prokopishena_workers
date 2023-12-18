// script.js

document.addEventListener("DOMContentLoaded", function() {
    // Отримуємо посилання на вікно та кнопки вибору користувача
    var customerBox = document.getElementById("customer-box");
    var studentsButton = document.getElementById("students_button");
    var workersButton = document.getElementById("workers_button");

    // Показати вікно при завантаженні сторінки
    customerBox.style.display = "block";

    // Додати обробники подій для кнопок вибору користувача
    studentsButton.addEventListener("click", function() {
        // Перенаправити користувача на сторінку для студентів (змініть URL на свій)
        window.location.href = "index.html";
    });

    workersButton.addEventListener("click", function() {
        // Перенаправити користувача на сторінку для працівників містечка (змініть URL на свій)
        window.location.href = "worker_page.html";
    });
});
