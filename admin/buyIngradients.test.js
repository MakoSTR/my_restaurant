const buyIngradients = require("./buyIngradients")
const operationWithBudget = require("../budget/operationWithBudget")
const operationWithWarehouse = require("../warehouse/operationWithWarehouse")
const user = require("../user/user")
const warehouseIngradients = require("../warehouse/warehouseIngradients")
const restaurantBudget = require("../budget/restaurantBudget")
const fs = require("fs");
const systemCommands = require("../systemCommands/systemCommands");
const operationWithChanceToSpoil = require("../warehouse/operationWithChanceToSpoil")
const operationWithWaste = require("../warehouse/operationWithWaste");

test("Функція, яка перевіряє, чи були додані інградієнти на склад." +
    "Також, якщо інградієнта немає в базових інградієнтах, то немає пройти операція додавання інградієнту.", function () {

    systemCommands.EXIT = jest.fn(systemCommands.EXIT).mockImplementationOnce(function () {

        console.log("Зупиняємо виконання програми.")
    })

    operationWithWarehouse.addIngradientsInWarehouse = jest.fn(operationWithWarehouse.addIngradientsInWarehouse).mockImplementation(function () {

        console.log("Перезаписуємо значення інградієнтів на складі у файл.")
    })

    operationWithWaste.addToWaste = jest.fn(operationWithWaste.addToWaste).mockImplementation(function () {

        console.log("Додаємо у смітник.")
    })

    operationWithChanceToSpoil.chackChanceToSpoil = jest.fn(operationWithChanceToSpoil.chackChanceToSpoil).mockImplementationOnce(function () {

        return 0
    })

    warehouseIngradients.warehouseIngradients["Chicken"] = 5
    var result1 = buyIngradients.addIngradients(["Chicken"], [2])
    expect(result1["Chicken"]).toBe(7)

    operationWithChanceToSpoil.chackChanceToSpoil = jest.fn(operationWithChanceToSpoil.chackChanceToSpoil).mockImplementationOnce(function () {

        return 0
    })

    warehouseIngradients.warehouseIngradients["Chicken"] = 5
    var result2 = buyIngradients.addIngradients(["Chicken"], [12])
    expect(result2["Chicken"]).toBe(10)

    operationWithChanceToSpoil.chackChanceToSpoil = jest.fn(operationWithChanceToSpoil.chackChanceToSpoil).mockImplementationOnce(function () {

        return 1
    })

    warehouseIngradients.warehouseIngradients["Chicken"] = 5
    var result2 = buyIngradients.addIngradients(["Chicken"], [3])
    expect(result2["Chicken"]).toBe(7)

    var result3 = buyIngradients.addIngradients(["EvilChicken"], [2])
    expect(result3).toBe(false)
})

test("Функція, яка перевіряє, що кошти за купівлю інградієнтів були зняті з бюджета." +
    "Також, якщо такого інградієнту немає, то гроші не повинні відніматись з бюджета.", function () {

    var result4 = restaurantBudget.budget
    var result1 = buyIngradients.removeMoney(["Chicken"], [2])
    var result5 = 40 * 0.1 + 40
    expect(parseInt(result1)).toBe(parseInt(result4) - result5)
    operationWithBudget._addToBudget(result5)

    var result2 = buyIngradients.removeMoney(["Chicken"], [1])
    var result6 = 20 * 0.1 + 20
    expect(parseInt(result2)).toBe(parseInt(result4) - result6)
    operationWithBudget._addToBudget(result6)

    var result3 = buyIngradients.removeMoney(["EvilChicken"], [2])
    expect(result3).toBe(false)
})