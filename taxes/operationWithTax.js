const operationWithPurchaseTax = require("./operationWithPurchaseTax")
const fs = require("fs")
const tax = require("./tax")
const operationWithLogs = require("../restaurantLogs/operationWithLogs")
const volatilityAmount = require('../volatility/volatility')

// Функція, яка вираховує податок і записує його у файл. А повертає ціну вже з вирахуваним податком.
module.exports.withdrawTaxes = function withdrawTaxes(value) {

    // Вираховуємо податок з ціни.
    var result = value * tax.tax

    // Викликаємо функцію, яка записує отриманий податок у файл.
    operationWithPurchaseTax.purchaseTax(parseFloat((result).toFixed(1)))

    // Віднімаємо податок від ціни.
    value = value - result

    // Виводимо інформацію для користувача з ціною страви і податком на неї.
    console.log("Вартість страви: " + value.toFixed(1))
    console.log("Податок на замовлення: " + result.toFixed(1))
    console.log("-------------------------------------------------------------")

    // Повертаємо ціну без податку.
    return parseFloat(value.toFixed(1))
}

// Функція, яка додає податок на ціну, яку отримуємо у параметрі.
module.exports.addTaxes = function addTaxes(value) {

    // Отримаєумо 10% від ціни в параметрі (10% по дефолту).
    var result = value * tax.tax
    // Додаємо податок до ціни.
    value = (parseFloat(value) + parseFloat(result.toFixed(1)))
    // console.log(parseFloat(value) + parseFloat(result.toFixed(1)) + " - @@@@@@@@@@@@@@@@@")
    // console.log(volatilityAmount.randomVolatilityData()[0] + " - !!!!!!!!!!!!!!!!!!!!!!!!!")
    console.log(value)

    // Записуємо інформацію про податок в логи.
    operationWithLogs.addLogs("Податок на замовлення: " + result)
    operationWithLogs.writeLogs()

    // Повертаємо ціну.
    return parseFloat(value)
}