const fs = require("fs");
const notBaseIngradients = require("../menu/notBaseIngradients")
const operationWithWarehouse = require("../warehouse/operationWithWarehouse")
const quantityInWarehouse = require("../warehouse/quantityReadyMealsInWarehouse");
const readyMeals = require("../warehouse/readyMeals")
const getIngradients = require("../menu/getIngradients")
const getPrice = require("../menu/getPrice")
const operationWithBudget = require("../budget/operationWithBudget")
const systemCommands = require("../systemCommands/systemCommands");
const restaurantBudget = require("../budget/restaurantBudget")
const operationWithTaxes = require("../taxes/operationWithTax");

// Потрібно зробити покупку готових страв, максимум 3. Доробити пункт 6.7.4
module.exports.addReadyMeals = function addReadyMeals(food, quantity) {

    // Перебираємо всі інградієнти і їх кількість, щоб записати локально на наш склад.
    for (var i = 0; i < food.length; i++) {

        // Якщо такий інградієнт є у нас на складі, то добавляємо його
        if (notBaseIngradients.notBaseIngradients.hasOwnProperty(food[i])) {

            // Перевіряємо, чи є місце на складі. Чи не перевищений ліміт.
            var result = quantityInWarehouse.checkQuantityOfReadyMeals(food[i], quantity[i])
            var quantity2 = result

            // Якщо на складі є місце, то додаємо значення кількості страв. Якщо його немає, то ми отримаємо 0 і нічого не зробимо.
            if (quantity2 !== 0) {

                // Процес додоавання інградієнтів на склад.
                readyMeals.readyMeals[food[i]] += parseInt(quantity2)
            }

        } else {

            // Якщо інградієнту на складі немає, то зупиняємо виконання програми.
            systemCommands.EXIT("Такого інградієнту немає на складі.")
            return false
        }
    }

    // Після завершення локального добавлення всіх інградієнтів на склад, передаємо наступній функції локальне значення складу.
    operationWithWarehouse.addReadyMeals(readyMeals.readyMeals)

    // Повертаємо кількість готових страв для тестування.
    return readyMeals.readyMeals
}

// Функція, яка віднімає з бюджета кошти за інградієнти, які входять у страву.
module.exports.removeMoney = function removeMoney(food, quantity) {

    // Локальне значення, в яке буде записуватись ціна за страву.
    var value = 0

    // Підраховуємо ціну всіх страв, які купляємо.
    for (var i = 0; i < food.length; i++) {

        // Перевіряємо, чи є страва в меню.
        if (notBaseIngradients.notBaseIngradients.hasOwnProperty(food)) {

            // Отримуємо всі інградієнти, які входять у страву.
            var ingradients = getIngradients.ingradients(food[i])

            // Отримуємо ціну всіх інградієнтів.
            var price = getPrice.price(ingradients)

            // Підраховуємо ціну страви разом з її кількістю і податок, після чого додаємо це значення у локальну змінну.
            value = value + (price * quantity[i]).toFixed(1)
        } else {

            // Якщо страви немає у меню, то повертаємо false для тестування.
            return false
        }
    }

    //
    var result = operationWithTaxes.addTaxes(value)

    // Віднімаємо ціну страв, які закупляємо.
    operationWithBudget._removeFromBudget(result)


    // Повертаємо значення бюджету для тестування.
    return restaurantBudget.budget
}