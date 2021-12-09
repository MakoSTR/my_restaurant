const fs = require("fs");
const foods = require("./allowableQuantityInStock/readyMeals")
const notBaseIngradients = require("../menu/notBaseIngradients")
const readyMeals = require("./readyMeals")
const operationWithTotalQuantityOfAllInWarehouse = require("./operationWithTotalQuantityOfAllInWarehouse")
const quantityIngradientsInWarehouse = require("./quantityIngradientsInWarehouse")
const audit = require('../restaurantLogs/audit');

// Функція, яка перевіряє максимальну допустиму кількість готових страв на складі. Тобто, кожну страву окремо.
module.exports.checkQuantityOfReadyMeals = function checkQuantityOfReadyMeals(food, quantity) {

    // По дефолту максимальна кількість готових страв 3.
    var maxQuantityOfReadyMeals = foods.readyMeals

    // Перевіряємо, чи є страва у меню.
    if (notBaseIngradients.notBaseIngradients.hasOwnProperty(food)) {

        // Отримуємо значення готових страв. А саме страви, яку замовляємо.
        var currentQuantityOfReadyMeals = readyMeals.readyMeals[food]

        // Додаємо кількість, яку ми замовили, до кількості, яка є на складі.
        var result = parseInt(currentQuantityOfReadyMeals) + parseInt(quantity)

        var result2 = operationWithTotalQuantityOfAllInWarehouse.checkTotalQuantity(quantityIngradientsInWarehouse.getTotalQuantityOfIngradients(),exports.getTotalQuantityOfReadyMeals())
        if (result2 === true){


        } else {
            console.log("Кількість товару перевищує загальну місткість складу.")
            console.log("Товар не буде добавлено на склад.")

            return false
        }

        // Якщо результат додавання готових страв і замовлених перевищує максимальну допустиму кількість кожної страви на складі, то переходимо сюди.
        if (result > maxQuantityOfReadyMeals) {

            // Від отриманого результату віднімаємо максимальну допустиму кількість.
            result = result - maxQuantityOfReadyMeals
            // Тепер отримуємо кількість, яку ми можемо добавити на склад.
            quantity = quantity - result

            // Показуємо, скільки зайвих страв було замовлено.
            console.log("Кількість замовлення перевищена: " + food + " - " + result)


            // Повертаємо кількість, яку можемо добавити на склад готових страв.
            return quantity

        }

        // Якщо сума готових страв і замовлених не перевищує ліміт, то просто повертаємо значення кількості замовлення.

        return quantity
    }
}

// Функція, яка повертає загальну суму всіх готових страв на складі.
module.exports.getTotalQuantityOfReadyMeals = function getTotalQuantityOfReadyMeals() {

    // Початкове значення 0.
    var quantity = 0

    // Отримуємо кількість всіх готових страв на складі.
    for (var i = 0; i < Object.keys(readyMeals.readyMeals).length; i++) {

        // Отримуємо значення кількості кожної страви і додаємо це у локальну змінну кількості - quantity.
        quantity = quantity + Object.values(readyMeals.readyMeals)[i]
    }

    // Повертаємо суму кількостей всіх готових страв.
    return parseInt(quantity)
}