const baseIngradients = require("../warehouse/warehouseIngradients")
const operationWithWarehouse = require("../warehouse/operationWithWarehouse")
const getPrice = require("../menu/getPrice")
const operationWithBudget = require("../budget/operationWithBudget")
const fs = require("fs")
const restaurantBudget = require("../budget/restaurantBudget")
const operationWithTaxes = require("../taxes/operationWithTax")
const quantityInWarehouse = require("../warehouse/quantityIngradientsInWarehouse");
const systemCommands = require("../systemCommands/systemCommands")
const operationWithChanceToSpoil = require("../warehouse/operationWithChanceToSpoil")
const operationWithWaste = require("../warehouse/operationWithWaste");
const volatilityAmount = require('../volatility/volatility');
const operationWithLost = require("../restaurantLogs/operationWithLogs")
const operationWithGarbageTax = require("../taxes/operationWithGarbageTax");

// Функція, яка отримує масиви з інградієнтами і їх кількістю, щоб у подальшому добавити їх на склад.
module.exports.addIngradients = function addIngradients(ingradients, quantity) {

    // Перебираємо всі інградієнти і їх кількість, щоб записати локально на наш склад.
    for (var i = 0; i < ingradients.length; i++) {

        // Якщо такий інградієнт є у нас на складі, то добавляємо його
        if (baseIngradients.warehouseIngradients.hasOwnProperty(ingradients[i])) {

            var result = quantityInWarehouse.checkQuantityOfIngradients(ingradients[i], quantity[i])
            // if (result === false) return
            var quantity2 = result


            if (quantity2 !== 0) {
                // Процес додавання інградієнтів на склад.
                baseIngradients.warehouseIngradients[ingradients[i]] += parseInt(quantity2)

                var wastedIngredients = {}

                for (var j = 0; j < quantity2; j++) {

                    var result2 = operationWithChanceToSpoil.chackChanceToSpoil()


                    if (wastedIngredients[ingradients[i]] > 0) {
                        wastedIngredients[ingradients[i]] += result2
                    } else {
                        wastedIngredients[ingradients[i]] = 0
                        wastedIngredients[ingradients[i]] += result2
                    }

                    // console.log("chackChanceToSpoil: " + result2)

                    if (result2 > 0) {

                        for (var k = 0; k < result2; k++) {
                            ++j
                        }
                    }

                    baseIngradients.warehouseIngradients[ingradients[i]] -= result2
                    operationWithWaste.addToWaste([ingradients[i], result2])

                }

                if (Object.keys(wastedIngredients).length > 0) {

                    operationWithGarbageTax.getGarbageTax(wastedIngredients)
                }

            }

        } else {

            systemCommands.EXIT("Такого інградієнту немає на складі.")
            return false
        }
    }

    // Після завершення локального добавлення всіх інградієнтів на склад, передаємо наступній функції локальне значення складу.
    operationWithWarehouse.addIngradientsInWarehouse(baseIngradients.warehouseIngradients)

    return baseIngradients.warehouseIngradients
}

// Функція, яка отримує масиви з інградієнтами і їх кількістю, щоб у подальшому стягнути їх загальну вартість з бюджета.
module.exports.removeMoney = function removeMoney(ingradients, quantity) {
    // Пустий масив, в який ми будемо записувати всі інградієнти за які потрібно заплатити.
    // Важливо ! Ми добавляємо у масив всі інградієнти, за які потрібно заплатити.
    // Тобто, при вхідних даних ["Chicken"] і [2] в результаті буде ["Chicken","Chicken"].
    var ingradientsArray = []

    // Процес перебору всіх інградієнтів.
    for (var i = 0; i < ingradients.length; i++) {
        if (baseIngradients.warehouseIngradients.hasOwnProperty(ingradients[i])) {
            if (quantity[i] > 1) {
                // Якщо значення кількості інградієнту більше за 1, то записуємо стільки ж разів його у масив.
                for (var j = 0; j < quantity[i]; j++) {

                    // Процес запису у масив всіх інградієнтів.
                    ingradientsArray.push(ingradients[i])
                }
            } else {

                // Якщо значення кількості інградієнту 1, то просто записуємо його у файл.
                ingradientsArray.push(ingradients[i])
                // return true
            }
        } else {

            // Повертаємо false, якщо інградієнт не входить у список базових інградієнтів.
            return false
        }
    }

    // Масив зі всіма інградієнтами передаємо функції price() (-> getPrice.js), яка обраховує загальну їх вартість.
    var money = getPrice.price(ingradientsArray)

    let volatility = volatilityAmount.randomVolatilityData()[1]

    let result = operationWithTaxes.addTaxes(money) * volatility

    console.log(result.toFixed(2) + " - Price with volatility")


    // Передаємо змінну money з ціною у функцію _removeFromBudget(), яку потрібно зняти з бюджета.
    operationWithBudget.removeFromBudget(parseFloat(restaurantBudget.budget) - parseFloat(result))

    console.log(restaurantBudget.budget + " - Budget after subtracting price - tax - volatility")

    return restaurantBudget.budget
}