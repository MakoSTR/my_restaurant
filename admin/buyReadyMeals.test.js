const readyMeals = require("../warehouse/readyMeals")
const systemCommands = require("../systemCommands/systemCommands")
const buyReadyMeals = require("./buyReadyMeals")
const user = require("../user/user");
const operationWithWarehouse = require("../warehouse/operationWithWarehouse")
const warehouseIngradients = require("../warehouse/warehouseIngradients");
const buyIngradients = require("./buyIngradients");
const restaurantBudget = require("../budget/restaurantBudget");
const operationWithBudget = require("../budget/operationWithBudget");
const tipsService = require("../tips/tips");
const volatility = require("../volatility/volatility");

test("", function () {

    systemCommands.EXIT = jest.fn(systemCommands.EXIT).mockImplementationOnce(function () {

        console.log("Зупиняємо виконання програми.")
    })

    operationWithWarehouse.addReadyMeals = jest.fn(operationWithWarehouse.addReadyMeals).mockImplementation(function () {

        console.log("Записуємо у файл.")
    })

    readyMeals.readyMeals["Emperor Chicken"] = 1
    var result1 = buyReadyMeals.addReadyMeals(["Emperor Chicken"], [1])
    expect(result1["Emperor Chicken"]).toBe(2)

    readyMeals.readyMeals["Emperor Chicken"] = 1
    var result2 = buyReadyMeals.addReadyMeals(["Emperor Chicken"], [5])
    expect(result2["Emperor Chicken"]).toBe(3)

    var result3 = buyReadyMeals.addReadyMeals(["EvilChicken"], [2])
    expect(result3).toBe(false)
})

test("Функція, яка перевіряє, що кошти за купівлю інградієнтів були зняті з бюджета." +
    "Також, якщо такого інградієнту немає, то гроші не повинні відніматись з бюджета.", function () {

    operationWithBudget.checkBudgetForBankruptcy = jest.fn(operationWithBudget.checkBudgetForBankruptcy).mockImplementation(function () {

        console.log("Перевіряємо.")
    })

    volatility.randomVolatilityData = jest.fn(() => 0.9);

    var result4 = restaurantBudget.budget
    var result1 = buyReadyMeals.removeMoney(["Emperor Chicken"], [1])
    var result5 = 312.4 * volatility.randomVolatilityData
    expect(parseFloat(result1)).toBe(parseFloat(result4) - result5)
    operationWithBudget._addToBudget(result5)

    var result2 = buyReadyMeals.removeMoney(["Emperor Chicken"], [2])
    var result6 = 312.4 * 2 * volatility.randomVolatilityData
    expect(parseFloat(result2)).toBe(parseFloat(result4) - result6)
    operationWithBudget._addToBudget(result6)

    var result3 = buyReadyMeals.removeMoney(["EvilChicken"], [2])
    expect(result3).toBe(false)
})