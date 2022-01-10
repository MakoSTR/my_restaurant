const restaurantBudget = require("./restaurantBudget")
const user = require("../user/user")
const fs = require("fs")
const audit = require("../restaurantLogs/operationWithLogs")
const operationWithTax = require("../taxes/operationWithTax")
const operationWithDailyTax = require("../taxes/operationWithDailyTax")
const operationwithLogs = require("../restaurantLogs/operationWithLogs")
const systemCommands = require("../systemCommands/systemCommands")

// Функція, яка забирає з бюджету ціну страви і додає ціну разом з націнкою.
module.exports.Calculate = function Calculate() {

    // Вираховує податок з ціни замовлення.
    var result = operationWithTax.withdrawTaxes(user.getFullPayment())

    // Записуємо інформацію про бюджет до замовлення.
    operationwithLogs.addLogs("Бюджет до: " + parseFloat(restaurantBudget.budget))
    operationwithLogs.writeLogs()

    // Функція, якій передаємо параметрами бюджет і віднімаємо від нього ціну страви.
    // exports.removeFromBudget(parseFloat(restaurantBudget.budget) - parseFloat(user.getPrice()))

    // console.log("BUDGET: " + restaurantBudget.budget)

    // Якщо ціна без податку більша з 0, то додаємо її до бюджета.
    if (result <= 0) {

    } else {

        // Функція, якій передаємо параметрами бюджет і додаємо до цього ціну страви разом з націнкою.
        exports.addToBudget(parseFloat(restaurantBudget.budget) + parseFloat(result))
    }

    // Додаємо інформацію про бюджет в логи.
    // audit.addLogs(restaurantBudget.budget)

    // Перевіряємо бюджет на банкротство.
    exports.checkBudgetForBankruptcy()


    // Записуємо інформацію про бюджет після замовлення.
    operationwithLogs.addLogs("Бюджет після: " + parseFloat(restaurantBudget.budget))
    operationwithLogs.writeLogs()

    return true
}

// Функція видалення з бюджету коштів. Видаляє параметр, який передаємо у функцію.
module.exports.removeFromBudget = function removeFromBudget(value) {

    // Процес запису коштів в бюджет.
    fs.writeFileSync(__dirname + "/restaurantBudget.txt", JSON.stringify(value.toFixedNumber(1)))

    // Присвоюємо нове значення змінній, яка в собі має значення бюджета.
    // restaurantBudget.budget = JSON.stringify(parseFloat(value))

    // Викликаємо функцію, яка перевіряє бюджет. Якщо в ньому менше 0, то оголошуємо банкротство.
    exports.checkBudgetForBankruptcy()
}

// Функція, яка добавляє кошти у бюджет.
module.exports.addToBudget = function addToBudget(value) {


    // Процес запису коштів в бюджет.
    fs.writeFileSync(__dirname + "/restaurantBudget.txt", JSON.stringify((value.toFixedNumber(1))))

    // Присвоюємо нове значення змінній, яка в собі має значення бюджета.
    restaurantBudget.budget = JSON.stringify(parseFloat(value))

    // Викликаємо функцію, яка перевіряє бюджет. Якщо в ньому менше 0, то оголошуємо банкротство.
    exports.checkBudgetForBankruptcy()
}

// Функція, яка перевіряє бюджет на банкротство. Якщо менше 0, то оголошуємо банкротство.
module.exports.checkBudgetForBankruptcy = function checkBudgetForBankruptcy() {

    // Перевірка бюджету. Якщо в ньому менше 0, то оголошуємо банкротство і зупиняємо виконання програми.
    if (parseFloat(restaurantBudget.budget) < 0) {
        // console.log("Bankrupt")
        // console.log("EXIT: operationWithBudget.js")
        // process.exit(-1)
        systemCommands.EXIT("Рестатор банкрот.")
        return false
    }
}

// Функція, яка приймає вартість, яку потрібно відняти з бюджета. В якості параметра отримує ціну.
// Можна використовувати як функцію, яка може віднімати з бюджету кошти.
module.exports._removeFromBudget = function _removeFromBudget(value) {

    // З локального значення бюджета віднімає ціну і передає виконання функції removeFromBudget(), яка безспосередньо перезаписує новий бюджет на старий.
    exports.removeFromBudget(parseFloat(restaurantBudget.budget) - parseFloat(value))

    // Додаємо в логи інформацію про бюджет.
    // operationwithLogs.addLogs("restaurant budget:" + restaurantBudget.budget)

    // Повертаємо значення бюджету після операції віднімання.
    return parseFloat(restaurantBudget.budget)
}

// Функція, яка приймає вартість, яку потрібно відняти з бюджета. В якості параметра отримує ціну.
// Можна використовувати як функцію, яка може додавати в бюджет кошти.
module.exports._addToBudget = function _addToBudget(value) {

    // З локального значення бюджета віднімає ціну і передає виконання функції removeFromBudget(), яка безспосередньо перезаписує новий бюджет на старий.
    exports.addToBudget(parseFloat(restaurantBudget.budget) + parseFloat(value))

    // Додаємо в логи інформацію про бюджет.
    // operationwithLogs.addLogs("restaurant budget:" + restaurantBudget.budget)

    // Повертаємо значення бюджету після операція додавання
    return parseFloat(restaurantBudget.budget)
}

Number.prototype.toFixedNumber = function (digits, base) {
    var pow = Math.pow(base || 10, digits);
    return Math.round(this * pow) / pow;
}

module.exports.modifyRestaurantBudget = (sign, amount) => {
    if (sign === '=') {
        restaurantBudget.budget = amount;
        fs.writeFileSync(__dirname + "/restaurantBudget.txt", JSON.stringify((restaurantBudget.budget.toFixedNumber(1))))
    }
    if (sign === '+') {
        restaurantBudget.budget += amount;
        fs.writeFileSync(__dirname + "/restaurantBudget.txt", JSON.stringify((restaurantBudget.budget.toFixedNumber(1))))

    }
    if (sign === '-') {
        restaurantBudget.budget -= amount;
        fs.writeFileSync(__dirname + "/restaurantBudget.txt", JSON.stringify((restaurantBudget.budget.toFixedNumber(1))))
    }
}

// module.exports = { modifyRestaurantBudget };
