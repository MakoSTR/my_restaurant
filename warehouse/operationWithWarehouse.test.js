const operationWithWarehouse = require("./operationWithWarehouse")
const readyMeals = require("./readyMeals");
const user = require("../user/user");
const fs = require("fs");
const warehouseIngradients = require("../warehouse/warehouseIngradients");
const systemCommands = require("../systemCommands/systemCommands")
const audit = require("../restaurantLogs/operationWithLogs");
const operationWithTotalQuantityOfAllInWarehouse = require("./operationWithTotalQuantityOfAllInWarehouse");
const buyReadyMeals = require("../admin/buyReadyMeals");
const operationWithLogs = require("../restaurantLogs/operationWithLogs")
const operationWithBudget = require("../budget/operationWithBudget")
const operationWithChanceToSpoil = require("./operationWithChanceToSpoil");
const operationWithWaste = require("./operationWithWaste")
const restaurantBudget = require("../budget/restaurantBudget")

test("Перевіряємо функцію, яка віднімає готові страви зі складу. На вхід подаємо кілкьість страв - 3, в результаті маємо отримати на 1 менше.", function () {

    // Мокаємо функцію запису.
    operationWithWarehouse.writeFile_removeIngradientsFromWarehouse = jest.fn(operationWithWarehouse.writeFile_removeIngradientsFromWarehouse).mockImplementationOnce(function () {

        console.log("Запис у файл")
    })

    // Мокаємо функцію запису.
    operationWithWarehouse.writeFile_removeFoodFromReadyMeals = jest.fn(operationWithWarehouse.writeFile_removeFoodFromReadyMeals).mockImplementationOnce(function () {

        console.log("Запис у файл")
    })

    // Мокаємо функцію виходу з програми.
    systemCommands.EXIT = jest.fn(systemCommands.EXIT).mockImplementationOnce(function () {

        console.log("Вихід з програми.")
    })

    // Мокаємо функцію додавання інформації в логи.
    audit.addLogs = jest.fn(audit.addLogs).mockImplementationOnce(function () {

        console.log("Добавляємо інформацію в логи.")
    })

    user.setFood("Princess Chicken")
    warehouseIngradients.warehouseIngradients["Chicken"] = 10
    readyMeals.readyMeals["Youth Sauce"] = 3
    readyMeals.readyMeals["Princess Chicken"] = 0
    var result = operationWithWarehouse.removeIngradientsFromWarehouse()
    expect(result[0]["Chicken"]).toBe(9)
    expect(result[1]["Youth Sauce"]).toBe(2)
})

test("Перевіряємо функцію додавання інградієнтів на склад. На вхідні дані передаємо + 1, маємо отримати 6 = 5 + 1.", function () {

    // Мокаємо функцію запису файлу, щоб ооригінальний файл з додаванням інградієнтів на склад не змінювався.
    operationWithWarehouse.writeFile_addIngradientsInWarehouse = jest.fn(operationWithWarehouse.writeFile_addIngradientsInWarehouse).mockImplementationOnce(function () {

        console.log("Записується у файл.")
    })

    // Вхідні дані - 5 шт. Chicken. Маємо отримати 6 = 5 + 1.
    warehouseIngradients.warehouseIngradients["Chicken"] = 5
    var quantity = warehouseIngradients.warehouseIngradients["Chicken"]
    warehouseIngradients.warehouseIngradients["Chicken"] = warehouseIngradients.warehouseIngradients["Chicken"] + 1
    var result = operationWithWarehouse.addIngradientsInWarehouse(warehouseIngradients.warehouseIngradients)
    expect(result["Chicken"]).toBe(quantity + 1)
})

test("Перевіряємо функцію, яка в свою чергу перевіряє кількість інградієнтів на складі під час замовлення." +
    "Якщо кількість інградієнтів більша за 0, то все добре, повертаємо кількість. Якщо менша за 0, то зупиняєм виконання програми.", function () {

    // Мокаємо функцію виходу з програми.
    systemCommands.EXIT = jest.fn(systemCommands.EXIT).mockImplementationOnce(function () {

        console.log("Вихід з програми")
    })

    // Якщо інградієнтів більше за 0, то маємо отримати цю кількість.
    var result = operationWithWarehouse.checkIngradients(10)
    expect(result).toBe(10)

    // Якщо інградієнтів менше за 0, то маємо отримати false (буде здійснено вихід з програми).
    var result2 = operationWithWarehouse.checkIngradients(-5)
    expect(result2).toBe(false)
})

test("Перевіряємо функцію, яка віднімає інградієнти зі складу. На вхід подаємо кілкьість інградієнтів - 5, в результаті маємо отримати на 1, 2 і 3 менше.", function () {

    operationWithWaste.addToWaste = jest.fn(operationWithWaste.addToWaste).mockImplementation(function () {

        console.log("Додаємо у смітник.")
    })

    // Мокаємо функцію запису.
    operationWithWarehouse.writeFile_removeIngradientsFromWarehouse = jest.fn(operationWithWarehouse.writeFile_removeIngradientsFromWarehouse).mockImplementation(function () {

        console.log("Запис у файл")
    })

    // Мокаємо функцію запису.
    operationWithWarehouse.writeFile_removeFoodFromReadyMeals = jest.fn(operationWithWarehouse.writeFile_removeFoodFromReadyMeals).mockImplementation(function () {

        console.log("Запис у файл")
    })

    // Мокаємо функцію виходу з програми.
    systemCommands.EXIT = jest.fn(systemCommands.EXIT).mockImplementationOnce(function () {

        console.log("Вихід з програми.")
    })

    // Мокаємо функцію додавання інформації в логи.
    audit.addLogs = jest.fn(audit.addLogs).mockImplementationOnce(function () {

        console.log("Добавляємо інформацію в логи.")
    })

    // Мокаємо функцію рандома.
    operationWithChanceToSpoil.chackChanceToSpoil = jest.fn(operationWithChanceToSpoil.chackChanceToSpoil).mockImplementationOnce(function () {

        return 0
    })

    user.setFood("Fries")
    warehouseIngradients.warehouseIngradients["Potatoes"] = 8
    readyMeals.readyMeals["Fries"] = 0
    var result = operationWithWarehouse.removeIngradientsFromWarehouse()
    expect(result[0]["Potatoes"]).toBe(7)

    // Мокаємо функцію рандома.
    operationWithChanceToSpoil.chackChanceToSpoil = jest.fn(operationWithChanceToSpoil.chackChanceToSpoil).mockImplementationOnce(function () {

        return 1
    })

    user.setFood("Fries")
    warehouseIngradients.warehouseIngradients["Potatoes"] = 10
    readyMeals.readyMeals["Fries"] = 0
    var result = operationWithWarehouse.removeIngradientsFromWarehouse()
    expect(result[0]["Potatoes"]).toBe(8)

    // Мокаємо функцію рандома.
    operationWithChanceToSpoil.chackChanceToSpoil = jest.fn(operationWithChanceToSpoil.chackChanceToSpoil).mockImplementationOnce(function () {

        return 2
    })

    user.setFood("Fries")
    warehouseIngradients.warehouseIngradients["Potatoes"] = 5
    readyMeals.readyMeals["Fries"] = 0
    var result = operationWithWarehouse.removeIngradientsFromWarehouse()
    expect(result[0]["Potatoes"]).toBe(2)
})

test("Функція, яка перевіряє, що в разі, якщо немає готової страви на складі, яка входить в склад страви, яку замовив користувач - буде приготовлено нову страву (інгрідаєнт).", function () {


    // Мокаємо функцію запису.
    operationWithWarehouse.writeFile_removeIngradientsFromWarehouse = jest.fn(operationWithWarehouse.writeFile_removeIngradientsFromWarehouse).mockImplementation(function () {

        console.log("Запис у файл")
    })

    // Мокаємо функцію запису.
    operationWithWarehouse.writeFile_removeFoodFromReadyMeals = jest.fn(operationWithWarehouse.writeFile_removeFoodFromReadyMeals).mockImplementation(function () {

        console.log("Запис у файл")
    })

    // Мокаємо функцію виходу з програми.
    systemCommands.EXIT = jest.fn(systemCommands.EXIT).mockImplementationOnce(function () {

        console.log("Вихід з програми.")
    })

    // Мокаємо функцію додавання інформації в логи.
    audit.addLogs = jest.fn(audit.addLogs).mockImplementationOnce(function () {

        console.log("Добавляємо інформацію в логи.")
    })

    // Мокаємо функцію рандома.
    operationWithChanceToSpoil.chackChanceToSpoil = jest.fn(operationWithChanceToSpoil.chackChanceToSpoil).mockImplementationOnce(function () {

        return 0
    })

    user.setFood("Princess Chicken")
    warehouseIngradients.warehouseIngradients["Chicken"] = 5
    readyMeals.readyMeals["Princess Chicken"] = 0
    readyMeals.readyMeals["Youth Sauce"] = 0
    warehouseIngradients.warehouseIngradients["Asparagus"] = 1
    warehouseIngradients.warehouseIngradients["Milk"] = 2
    warehouseIngradients.warehouseIngradients["Honey"] = 3

    var result = operationWithWarehouse.removeIngradientsFromWarehouse()
    expect(result[0]["Chicken"]).toBe(4)
    expect(result[0]["Asparagus"]).toBe(0)
    expect(result[0]["Milk"]).toBe(1)
    expect(result[0]["Honey"]).toBe(2)
})

test("Перевіряємо функцію віднімання інградієнтів, якщо на складі немає їх у наявності. На вхід подаємо значення менше 0, щоб перевірити, чи спрацють 2 варіанти, а саме: 1) функція перевірки" +
    "інградієнтів на складі має повернути - false, 2) основна функція має віднімати кількість інградієнтів зі складу.", function () {

    // Мокаємо функцію виходу з програми.
    systemCommands.EXIT = jest.fn(systemCommands.EXIT).mockImplementationOnce(function () {

        console.log("Вихід з програми.")
    })

    operationWithWarehouse.writeFile_removeIngradientsFromWarehouse = jest.fn(operationWithWarehouse.writeFile_removeIngradientsFromWarehouse).mockImplementationOnce(function () {

        console.log("Видаляємо інградієнти.")
    })

    // Робимо кількість інградієнту на складі 0. Віднімаємо від нього 1, тобто, кількість, яка входить у замовлення. В результаті має вийти мінусове значення.
    // user.setIngradients(["Chicken"])
    warehouseIngradients.warehouseIngradients["Chicken"] = 0
    warehouseIngradients.warehouseIngradients["Chicken"] = warehouseIngradients.warehouseIngradients["Chicken"] - 1

    // Якщо мінусове значення, то функція перевірки інградієнтів повертає - false. В такому випадку програма завершується.
    var result2 = operationWithWarehouse.checkIngradients(warehouseIngradients.warehouseIngradients["Chicken"])
    expect(result2).toBe(false)

    // Програму не завершуємо, щоб перевірити, чи працює віднімання інградієнтів.
    warehouseIngradients.warehouseIngradients["Chicken"] = 5
    var quantity = warehouseIngradients.warehouseIngradients["Chicken"]
    var result = operationWithWarehouse.checkIngradients(warehouseIngradients.warehouseIngradients["Chicken"])
    expect(result).toBe(quantity)
})

test("Перевіряємо функцію, яка віднімає готову страву зі складу. На вхідні дані передаємо, що готових страв у нас 10, маємо в результаті отримати 9 = 10 - 1.", function () {

    // Мокаємо функцію запису у файл.
    // Через те, що ми маємо продовжити операцію з новими даними, проводимо віднімання страви, яке зберігається у локальному значенні.
    // Фізично нове значення не перезаписуємо.
    operationWithWarehouse.removeFoodFromReadyMeals = jest.fn(operationWithWarehouse.removeFoodFromReadyMeals).mockImplementationOnce(function () {

        readyMeals.readyMeals["Emperor Chicken"] = readyMeals.readyMeals["Emperor Chicken"] - 1
    })

    // На вхід подаємо страву, яка є у наявності на складі (їх у нас 10), потім віднімаємо 1 від загальної кількості і отримуємо 9 = 10 - 1.
    user.setFood("Emperor Chicken")
    readyMeals.readyMeals[user.getFood()] = 10
    var result = operationWithWarehouse.Calculate()
    expect(result[0]).toBe("Emperor Chicken")
    expect(result[1]).toBe(9)
})

test("Функція, яка перевіряє функцію запису нових даних у файл з готовими стравами.", function () {

    operationWithWarehouse.writeFile_addReadyMeals = jest.fn(operationWithWarehouse.writeFile_addReadyMeals).mockImplementationOnce(function () {

        readyMeals.readyMeals["Emperor Chicken"] += 1
        console.log("Записуємо у файл.")
    })

    readyMeals.readyMeals["Emperor Chicken"] = 5
    var result = operationWithWarehouse.addReadyMeals()
    expect(result["Emperor Chicken"]).toBe(6)
})

test("Перевіряємо другу частину функції Calculate(), яка віднімає все, що входить у страву, яку замовив користувач.", function () {

    operationWithLogs.addLogs = jest.fn(operationWithLogs.addLogs).mockImplementationOnce(function () {

        console.log("Додаємо інформацію в логи.")
    })

    operationWithLogs.writeLogs = jest.fn(operationWithLogs.writeLogs).mockImplementationOnce(function () {

        console.log("Записуємо логи у файл.")
    })

    operationWithWaste.addToWaste = jest.fn(operationWithWaste.addToWaste).mockImplementationOnce(function () {

        console.log("Додаємо у смітник.")
    })

    operationWithWarehouse.writeFile_removeFoodFromReadyMeals = jest.fn(operationWithWarehouse.writeFile_removeFoodFromReadyMeals).mockImplementationOnce(function () {

        console.log("Видаляємо готові страви.")
    })

    operationWithWarehouse.writeFile_removeIngradientsFromWarehouse = jest.fn(operationWithWarehouse.writeFile_removeIngradientsFromWarehouse).mockImplementationOnce(function () {

        console.log("Видаляємо інградієнти.")
    })

    user.getHaveAllergy = jest.fn(user.getHaveAllergy).mockImplementationOnce(function () {

        return []
    })

    user.setFood("Fries")
    readyMeals.readyMeals["Fries"] = 0
    warehouseIngradients.warehouseIngradients["Potatoes"] = 5
    var result = operationWithWarehouse.Calculate()
    expect(result[1]["Potatoes"]).toBe(4)
})

test("Перевіряємо функцію додавання готовї страви на склад, якщо в користувача є алергія і ціна страви більша за вказану (по дефолту 20).", function () {

    operationWithLogs.addLogs = jest.fn(operationWithLogs.addLogs).mockImplementationOnce(function () {

        console.log("Додаємо інформацію в логи.")
    })

    operationWithLogs.writeLogs = jest.fn(operationWithLogs.writeLogs).mockImplementationOnce(function () {

        console.log("Записуємо логи у файл.")
    })

    buyReadyMeals.addReadyMeals = jest.fn(buyReadyMeals.addReadyMeals).mockImplementationOnce(function () {

        readyMeals.readyMeals["Princess Chicken"] += 1
        console.log("Додаємо страву на склад.")
    })

    operationWithBudget._removeFromBudget = jest.fn(operationWithBudget._removeFromBudget).mockImplementationOnce(function () {

        // restaurantBudget.budget = restaurantBudget.budget - 5
        console.log("Забираємо кошти з бюджета.")
    })

    readyMeals.readyMeals["Princess Chicken"] = 0
    user.setFood("Princess Chicken")
    user.setFullPayment(126)

    var result = operationWithWarehouse.addFood(["Chicken"])
    expect(result["Princess Chicken"]).toBe(1)

    readyMeals.readyMeals["Fries"] = 0
    user.setFood("Fries")
    user.setFullPayment(15)
    restaurantBudget.budget = 500
})

test("Функція, яка перевіряє, що страва буде відправлена у смітник, а з бюджета будуть списані за неї кошти.", function () {


    operationWithLogs.addLogs = jest.fn(operationWithLogs.addLogs).mockImplementationOnce(function () {

        console.log("Додаємо інформацію в логи.")
    })

    operationWithLogs.writeLogs = jest.fn(operationWithLogs.writeLogs).mockImplementationOnce(function () {

        console.log("Записуємо логи у файл.")
    })

    buyReadyMeals.addReadyMeals = jest.fn(buyReadyMeals.addReadyMeals).mockImplementationOnce(function () {

        readyMeals.readyMeals["Princess Chicken"] += 1
        console.log("Додаємо страву на склад.")
    })

    operationWithBudget._removeFromBudget = jest.fn(operationWithBudget._removeFromBudget).mockImplementationOnce(function () {

        restaurantBudget.budget = restaurantBudget.budget - 5
        console.log("Забираємо кошти з бюджета.")
    })

    readyMeals.readyMeals["Fries"] = 0
    user.setFood("Fries")
    user.setFullPayment(15)
    restaurantBudget.budget = 500

    var result2 = operationWithWarehouse.addFood(["Potatoes"])
    expect(result2).toBe(495)
})