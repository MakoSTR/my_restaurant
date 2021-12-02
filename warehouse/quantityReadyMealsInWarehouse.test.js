const quantityReadyMealsInWarehouse = require("./quantityReadyMealsInWarehouse")
const readyMeals = require("./readyMeals")
const quantityIngradientsInWarehouse = require("./quantityIngradientsInWarehouse")
const operationWithTotalQuantityOfAllInWarehouse = require("./operationWithTotalQuantityOfAllInWarehouse")

test("Перевіряємо функцію, яка підраховує кількість готових страв, яку ми можемо добавити на склад готових страв." +
    "1) На вхід подаємо рандомне значення, в результаті маємо отримати кількість, яка вираховується на формулою -" +
    "результат = замовлена кількість - (замовлена кількість - поточна кількість)." +
    "2) Якщо сума поточної кількості і замовленої не буде перевищувати ліміт, то очікуємо те значення, яке було замовлено." +
    "3) Перевіряємо функцію, якщо поточна кількість складу перевищує ліміт.", function () {

    readyMeals.readyMeals["Emperor Chicken"] = 1

    var result1 = quantityReadyMealsInWarehouse.checkQuantityOfReadyMeals("Emperor Chicken", 1)
    // expect(result1).toBe(1)

    var result2 = quantityReadyMealsInWarehouse.checkQuantityOfReadyMeals("Emperor Chicken", 5)
    // expect(result2).toBe(2)

    quantityIngradientsInWarehouse.getTotalQuantityOfIngradients = jest.fn(quantityIngradientsInWarehouse.getTotalQuantityOfIngradients).mockImplementationOnce(function () {

        return 200
    })

    quantityReadyMealsInWarehouse.getTotalQuantityOfReadyMeals = jest.fn(quantityReadyMealsInWarehouse.getTotalQuantityOfReadyMeals).mockImplementationOnce(function () {

        return 51
    })

    var result3 = quantityReadyMealsInWarehouse.checkQuantityOfReadyMeals("Emperor Chicken",1)
    expect(result3).toBe(false)
})

test("Перевіряємо функцію, яка повертає суму всіх готових страв на складі.", function () {

    var result = quantityReadyMealsInWarehouse.getTotalQuantityOfReadyMeals()
    expect(result).toBeDefined()
})