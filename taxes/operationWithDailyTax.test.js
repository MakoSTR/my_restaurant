const operationWithDailyTax = require("./operationWithDailyTax")
const operationWithPurchaseTax = require("./operationWithPurchaseTax")
const budget = require("../budget/restaurantBudget")
const operationWithBudget = require("../budget/operationWithBudget")


test("Функція, яка перевіряє, чи був присвоєний бюджет локальній змінні.", function () {

    operationWithPurchaseTax.resetPurchaseTax = jest.fn(operationWithPurchaseTax.resetPurchaseTax).mockImplementationOnce(function () {

        console.log("Обнуляємо значення файлу.")
    })

    budget.budget = 500

    var result = operationWithDailyTax.openRestaurant()
    expect(result).toBe(500)
})

test("Функція, яка перевіряє, чи були присвоєні значення бюджета і податків за 'день'.", function () {

    operationWithPurchaseTax.getTaxes = jest.fn(operationWithPurchaseTax.getTaxes).mockImplementationOnce(function () {
        return 50
    })

    operationWithDailyTax.Calculate = jest.fn(operationWithDailyTax.Calculate).mockImplementationOnce(function () {
        console.log("Обраховуємо прибуток і податок.")
    })

    budget.budget = 200

    var result = operationWithDailyTax.closeRestaurant()
    expect(result[0]).toBe(200)
    expect(result[1]).toBe(50)
})

test("Функція, яка підраховує щоденний прибуток і податок." +
    "Перевіряємо два випадки." +
    "1) Прибуток додатній, значить має бути податок." +
    "2) Прибуток від'ємний, значить немає бути податку.", function () {

    operationWithBudget._removeFromBudget = jest.fn().mockImplementation(function () {

        console.log("Видаляємо з бюджету файли.")
    })

    operationWithDailyTax.startBudget = 100.0
    operationWithDailyTax.endBudget = 200.0
    operationWithDailyTax._purchaseTax = 10.0

    var result1 = operationWithDailyTax.Calculate()
    expect(result1[0]).toBe(90)
    expect(result1[1]).toBe(18)

    operationWithDailyTax.startBudget = 100.0
    operationWithDailyTax.endBudget = 110.0
    operationWithDailyTax._purchaseTax = 12.0

    var result2 = operationWithDailyTax.Calculate()
    expect(result2[0]).toBe(-2)
    expect(result2[1]).toBe(-0.4)
})