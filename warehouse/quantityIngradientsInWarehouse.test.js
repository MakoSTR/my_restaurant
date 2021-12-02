const quantityReadyMealsInWarehouse = require("./quantityReadyMealsInWarehouse")
const readyMeals = require("./readyMeals")
const quantityIngradientsInWarehouse = require("./quantityIngradientsInWarehouse")
const operationWithTotalQuantityOfAllInWarehouse = require("./operationWithTotalQuantityOfAllInWarehouse")
const warehouseIngradients = require("./warehouseIngradients")
const systemCommands = require("../systemCommands/systemCommands")

test("Перевіряємо функцію, яка підраховує кількість інградієнтів, які ми можемо добавити на склад інградієнтів." +
    "1) На вхід подаємо рандомне значення, в результаті маємо отримати кількість, яка вираховується на формулою -" +
    "результат = замовлена кількість - (замовлена кількість - поточна кількість)." +
    "2) Якщо сума поточної кількості і замовленої не буде перевищувати ліміт, то очікуємо те значення, яке було замовлено." +
    "3) Перевіряємо функцію, якщо поточна кількість складу перевищує ліміт.", function () {

    warehouseIngradients.warehouseIngradients["Chicken"] = 5

    var result1 = quantityIngradientsInWarehouse.checkQuantityOfIngradients("Chicken", 1)
    expect(result1).toBe(1)

    warehouseIngradients.warehouseIngradients["Chicken"] = 5

    var result2 = quantityIngradientsInWarehouse.checkQuantityOfIngradients("Chicken", 15)
    expect(result2).toBe(5)


    quantityIngradientsInWarehouse.getTotalQuantityOfIngradients = jest.fn(quantityIngradientsInWarehouse.getTotalQuantityOfIngradients).mockImplementationOnce(function () {

        return 150
    })

    quantityReadyMealsInWarehouse.getTotalQuantityOfReadyMeals = jest.fn(quantityReadyMealsInWarehouse.getTotalQuantityOfReadyMeals).mockImplementationOnce(function () {

        return 51
    })

    systemCommands.EXIT = jest.fn(systemCommands.EXIT).mockImplementationOnce(function () {

        console.log("Зупиняємо виконання програми.")
    })

    var result3 = quantityIngradientsInWarehouse.checkQuantityOfIngradients("Chicken",1)
    expect(result3).toBe(false)
})

test("Перевіряємо функцію, яка повертає суму всіх інградієнтів на складі.", function () {

    var result = quantityIngradientsInWarehouse.getTotalQuantityOfIngradients()
    expect(result).toBeDefined()
})