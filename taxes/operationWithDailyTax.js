const fs = require("fs");
const budget = require("../budget/restaurantBudget")
const purchaseTax = require("./purchaseTax")
const operationWithPurchaseTax = require("./operationWithPurchaseTax")
const operationWithBudget = require("../budget/operationWithBudget")
const restaurantBudget = require("../budget/restaurantBudget")
const audit = require('../restaurantLogs/audit');
const operationWithGarbageTax = require("../taxes/operationWithGarbageTax")
const waste = require("../warehouse/waste")

module.exports.startBudget = startBudget = 0
module.exports.endBudget = endBudget = 0
module.exports._purchaseTax = _purchaseTax = 0

// Функція, яка у змінну записує стартовий бюджет.
module.exports.openRestaurant = function openRestaurant() {

    // Отриманий бюджет записуємо у локальну змінну.
    exports.startBudget = budget.budget

    // Функція, яка обнуляє значення файлу з податками.
    operationWithPurchaseTax.resetPurchaseTax()

    // Повертаємо нове значення локальної зміни, яка в собі має значення бюджету до старта програми.
    return exports.startBudget
}

// Функція, яка записує кінцеве значення бюджета і податків за всю роботу програми.
module.exports.closeRestaurant = function closeRestaurant() {

    var wastedIngadients = {}

    for (var i = 0; i < Object.keys(waste.waste).length; i++){

        if (Object.values(waste.waste)[i] > 0){

            wastedIngadients[Object.keys(waste.waste)[i]] = Object.values(waste.waste)[i]
        }
    }

    console.log(wastedIngadients)

    operationWithGarbageTax.getGarbageTax(wastedIngadients)

    // Записуємо кінцеве значення бюджета.
    exports.endBudget = budget.budget
    // Записуємо у локальну змінну податки за весь день.
    exports._purchaseTax = operationWithPurchaseTax.getTaxes()

    // Викликаємо функцію, яка обраховує всі 3 значення, щоб заплатити податок, якщо прибуток більший за 0.
    exports.Calculate()

    return [exports.endBudget, exports._purchaseTax]
}

// Функція, яка обраховує прибуток і податок. В разі від'ємного прибутку - податок не сплачуємо.
module.exports.Calculate = function Calculate() {

    // Отримуємо чистий прибуток за "день".
    var result = exports.endBudget - exports.startBudget - exports._purchaseTax

    // Отримуємо податок за "день".
    var value = result.toFixed(1) * 0.2

    // Якщо прибуток за день додатній, то виконуємо наступні операції.
    if (result.toFixed(1) > 0) {

        // Виводимо інформацію про прибуток.
        console.log("Щоденний прибуток: " + result.toFixed(1))

        const endMessage = {
            "DAILY TAX": result.toFixed(1)
        }

        audit.addToAudit(endMessage);
        // Виводимо інформацію про податок.
        console.log("Щоденний податок: " + value.toFixed(1))
        console.log("-------------------------------------------------------------")

        // Віднімаємо з бюджета податки.
        operationWithBudget._removeFromBudget(value.toFixed(1))

        // Повертаємо значення прибутку і податку.
        return [result, value]
    } else {

        // Якщо прибуток за день від'ємний, то з бюджета нічого не вираховуємо, а просто виводимо про це інформацію.
        console.log("Прибуток за день менший за 0. Тому податок не сплачуємо.")
        console.log("-------------------------------------------------------------")

        return [result, value]
    }
}