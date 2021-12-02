const fs = require("fs")
const totalQuantity = require("./allowableQuantityInStock/totalQuantity")
const quantityIngradientsInWarehouse = require("./quantityIngradientsInWarehouse")
const quantityReadyMealsInWarehouse = require("./quantityReadyMealsInWarehouse")

// Функція, яка перевіряє, чи є місце для замовлення.
module.exports.checkTotalQuantity = function checkTotalQuantity(ingradients, readyMeals) {

    // Отримуємо максимальне значення кількості всіх матеріалів на складі.
    var result1 = totalQuantity.totalQuantity
    console.log("Максимальна кількість: " + result1)

    // Отримуємо суму всіх інградієнтів і готових страв на складі.
    var result2 = ingradients + readyMeals
    console.log("Загальна кількість: " + result2)

    // Отримуємо число. Якщо місце на складі є, воно завжди буде додатне. Якщо місця немає, то від'ємним.
    var result3 = result1 - result2

    // Якщо число додатне, то місце є, нічого не робимо.
    if (result3 >= 0) {

        return true
    } else {
        // Якщо місця немає, то повертаємо значення, щоб повідомити користувача про ліміт і для подальшого виходу з програми.
        return result3
    }
}