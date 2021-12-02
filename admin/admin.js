const buyIngradients = require("./buyIngradients")
const getPrice = require("../menu/getPrice")
const operationWithbudget = require("../budget/operationWithBudget")
const accessRights = require("../accessRights/accessRights")
const buyReadyMeals = require("./buyReadyMeals")
const quantityIngradientsInWarehouse = require("../warehouse/quantityIngradientsInWarehouse")
const quantityReadyMealsInWarehouse = require("../warehouse/quantityReadyMealsInWarehouse")
const operationWithTotalQuantity = require("../warehouse/operationWithTotalQuantityOfAllInWarehouse")
const operationWithLogs = require("../restaurantLogs/operationWithLogs")
const operationWithWaste = require("../warehouse/operationWithWaste")

admin()

// Головне функція для адміністратора.
function admin() {

    if (accessRights.getOrderCommand() === false) {

        console.log("Команда для покупок відключена.")
        return
    }
    // Виклика

    // Функція, яка дозволяє добавити нові кошти в бюджет.
    // addMoneyToBudget(100)

    // Функція, яка дозволяю відняти кошти з бюджету.
    // removeMoneyFromBudget(100)

    if (accessRights.getOrder_command_baseIngradients() === false) {

        console.log("Команда для покупки інградієнтів відключена.")
        return
    }
    // Викликаємо функцію, якій передаємо масив з інградієнтами і масив з кількістю інградієнтів.
    // Вона виконує процес добавлення нових інградієнтів на склад, а також стягує їх вартість з бюджета.
    // buyNewIngradients(["Chicken"], [10])

    if (accessRights.getOrder_command_readyMeals() === false) {

        console.log("Команда для покупки страв відключена.")
        return
    }
    // Викликаємо
    // Функція, яка купляє готові страви.
    // addReadyMeals(["Fries"], [1])

    // operationWithLogs.writeLogs()

    // Провіряємо, чи є право на покупку.
    if (accessRights.getOrder_command_baseIngradients() === false && accessRights.getOrder_command_readyMeals() === false) {

        console.log("Команда для покупки інградієнтів, або страв - відключена.")
        return
    }
    // Функція, яка додає інградієнти і страви на склад одночасно.
    // addIngradientsAndReadyMeals([["Potatoes"], [1], ["Fries"], [1]])

    //
    operationWithWaste.clearWaste()
}

//
function addIngradientsAndReadyMeals(array) {

    buyNewIngradients(array[0], array[1])
    addReadyMeals(array[2], array[3])
}

// Функція, яка в якості параметра приймає страви і їх кількість, щоб додати на склад.
function addReadyMeals(food, quantity) {

    // Функція, яка додає страви на склад.
    buyReadyMeals.addReadyMeals(food, quantity)

    // Додаємо в логи інформацію, які саме страви були закуплені.
    operationWithLogs.addLogs("Куплені страви:" + food)
    // Додаємо в логи інформацію, скільки страв було закуплено.
    operationWithLogs.addLogs("Кількість страв:" + quantity)
    operationWithLogs.writeLogs()

    // Функція, яка віднімає ціну за страви з бюджету.
    buyReadyMeals.removeMoney(food, quantity)
}

// Функція додавання коштів в бюджет.
function addMoneyToBudget(money) {

    // Беспосередньо сама функція додавання не виконує.
    // Вона передає виконання функції, яка знаходиться у бюджеті, яка в свою чергу буде проводити операцію додавання.
    operationWithbudget._addToBudget(money)

    // Додаємо інформацію в логи про зміни в бюджеті.
    operationWithLogs.addLogs("Додаємо кошти в бюджета: " + money)
    operationWithLogs.writeLogs()
}

// Функція віднімання коштів з бюджету.
function removeMoneyFromBudget(money) {

    // Беспосередньо сама функція віднімання не виконує.
    // Вона передає виконання функції, яка знаходиться у бюджеті, яка в свою чергу буде проводити операцію віднімання.
    operationWithbudget._removeFromBudget(money)

    // Додаємо інформацію в логи про зміни в бюджеті.
    operationWithLogs.addLogs("Віднімаємо кошти з бюджета: " + money)
    operationWithLogs.writeLogs()
}

// Функція, яка в якості параметра приймає масиви з інградієнтами і їх кількістю.
function buyNewIngradients(ingradients, quantity) {

    // Масиви з інградієнтами і їх кількістю передаємо у функцію buyIngradientsForWarehouse().
    // В подальшому вона буде добавляти інградієнти на склад.
    buyIngradientsForWarehouse(ingradients, quantity)

    // Додаємо в логи інформацію, які саме інградієнти були закуплені.
    operationWithLogs.addLogs("Куплені інградієнти:" + ingradients)
    // Додаємо в логи інформацію, скільки інградієнтів було закуплено.
    operationWithLogs.addLogs("Кількість інградієнтів:" + quantity)
    operationWithLogs.writeLogs()

    // Масиви з інградієнтами і їх кількістю передаємо у функцію removeFromBudget().
    // В подальшому вона обрахує вартість всіх інградієнтів і стягне вартість їх з бюджету.
    removeFromBudget(ingradients, quantity)
}

// Функція, яка приймає масиви з інградієнтами і їх кількістю.
function buyIngradientsForWarehouse(ingradients, quantity) {

    // Отримані масиви з інградієнтами і їх кількістю передаємо у функцію, яка буде локально добавляти їх на склад.
    buyIngradients.addIngradients(ingradients, quantity)
}

// Функція, яка приймає масив з інградієнтами і їх кількістю.
function removeFromBudget(ingradients, quantity) {

    // Отримані масиви з інградієнтами і їх кількістю передаємо у функцію, яка буде обраховувати їх загальну вартість.
    buyIngradients.removeMoney(ingradients, quantity)
}