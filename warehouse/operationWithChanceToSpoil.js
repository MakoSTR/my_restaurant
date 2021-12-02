const chanceToSpoil = require("./chanceToSpoil")

// Локальна змінна, в якій зберігається кількість співпадінь.
var x = 0

// Функція, яка перевіряє кількість співпадінь і повертає це значення.
module.exports.chackChanceToSpoil = function chackChanceToSpoil() {

    x = 0

    // Беспосередньо сама функція, яка перевіряє співпадіння.
    exports.random()

    // Повертаємо кількість співпадінь.
    return x
}

// Функція, яка перевіряє співпадіння.
module.exports.random = function random() {

    // Викликаємо функцію, передаємо параметрами два числа: 1 і 1001. Отриманий результат присвоєюмо у змінну result.
    var result = exports.getRandomInt(1, chanceToSpoil.chanceToSpoil + 1)

    // Перевіряємо, чи отриманий результат збігається з очікуваним числом (по дефолту 1000).
    if (result === chanceToSpoil.chanceToSpoil) {

        // Якщо число збігається, то збільшуємо значення х на 1.
        x = x + 1

        // Виконуємо рекурсію.
        // Потрібно для того, щоб перевірити, чи буде повторно згенероване очікуване число.
        exports.random()
    } else {

        // Якщо числа не збігаються, завершуємо виконання функції.
        return true
    }
}

// Функція рандому.
module.exports.getRandomInt = function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}