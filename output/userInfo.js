const user = require("../user/user")
const chalk = require("chalk")
const operationWithWarehouse = require("../warehouse/operationWithWarehouse")
const percent = require("../taxes/percent")
const operationWithVisits = require("../visits/operationWithVisits")
const audit = require("../restaurantLogs/operationWithLogs")
const operationWithBudget = require("../budget/operationWithBudget")
const systemCommands = require("../systemCommands/systemCommands")
const restaurantBudget = require("../budget/restaurantBudget")
const operationWithTotalQuantityOfAllInWarehouse = require("../warehouse/operationWithTotalQuantityOfAllInWarehouse");
const quantityReadyMealsInWarehouse = require("../warehouse/quantityReadyMealsInWarehouse");
const quantityIngradientsInWarehouse = require("../warehouse/quantityIngradientsInWarehouse");
const addReadyMeals = require("../admin/buyReadyMeals")
const readyMeals = require("../warehouse/readyMeals")
const operationWithLogs = require("../restaurantLogs/operationWithLogs")
const auditAction = require('../restaurantLogs/audit');
const fs = require("fs");

// Функція, яки виводить базову інформацію для користувача.
module.exports.StartInfoForUser = function StartInfoForUser() {

    // Виводимо для користувача всю необхідну інформацію.
    console.log("-------------------------------------------------------------")

    // Привітання.
    console.log("Welcome to our Restaurant !")

    // Ім'я користувача.
    console.log("Your name: " + user.getName())

    // Бюджет користувача.
    console.log("Your budget: " + user.getBudget())

    // Їжа, яку замовив користувач.
    console.log("Your food: " + user.getFood())

    // Алергія користувача.
    console.log("Your allergie: " + user.getAllergy())

    // Ціна страви, яку повинен заплатити користувач, разом з %.
    console.log("You need to pay: " + exports.fullPayment())

    console.log("-------------------------------------------------------------")

    // Масив з алергіями. Пустий, якщо немає алергії.
    console.log("You have allergy: " + exports.haveAllergy())

    // Бюджет користувача після замовлення.
    if (user.getFullPayment() <= 0) {
        console.log("Your budget after pay: " + user.getBudget())
    } else {
        console.log("Your budget after pay: " + exports.budgetAfterPay())
    }

    // Функція, яка перевіряє, чи всі вхідні дані задовілняють умови програми, щоб продовжити виконання.
    const result = exports.start()

    console.log("-------------------------------------------------------------")

    // Повертаємо значення користувача для тестування.
    return [user.getName(), user.getBudget(), user.getFood(), user.getAllergy(), user.getFullPayment(), user.getHaveAllergy(), user.getBudgetAfterPay(), result]
}

// Функція, яка повертає ціну разом з %.
module.exports.fullPayment = function fullPayment() {

    // Знижка, яку отримує користувач, якщо вона в нього є.
    var _percent = percent.percent

    // Отримуємо інформацію, чи є знижка у користувача.
    var result = operationWithVisits.getDiscount()

    // Якщо є знижка, виконуємо виконуємо процес зменшення вартості користувача і обнулення його відвідувань.
    if (result > 0) {

        // Додаємо в логи інформацію про знижку.
        audit.addLogs("Користувач має знижку: " + result + " %")
        audit.writeLogs()

        // Обнуляємо кількість відвідувань користувачем.
        operationWithVisits.resetVisits()

        // Тут срака. Логіка ніби проста.
        // Якщо відвідувач отримує знижку, то ми повинні відняти її % від загальної суми і додати її в бюджет.
        // Проблема полягає в тому, що я не знаю, чи логіка з % тут правильна.
        // Якщо замовляти 1 страву і користувач отримує знижку, то прибуток дуже маленький.
        // В теорії, все правильно правильно, тільки ДУЖЕ детально не перевірено.
        if ((user.getPrice() * _percent * result).toFixed(1) < 0) {

            user.setFullPayment(parseFloat(0))

            return parseFloat(0)
        } else {

            var value = user.getPrice() * _percent * result
            value = user.getPrice() * _percent - value


            user.setFullPayment(parseFloat((value).toFixed(1)))

            return parseFloat((value).toFixed(1))
        }

    } else {

        user.setFullPayment(parseFloat((user.getPrice() * _percent).toFixed(1)))

        return parseFloat((user.getPrice() * _percent).toFixed(1))
    }
}

// Функція, яка перевіряє, чи є алергія. Тобто, якщо масив більше за 1, то є, якщо в іншому випадку повертає "Nothing".
module.exports.haveAllergy = function haveAllergy() {

    if (user.getHaveAllergy().length > 0) {

        // Повертає масив з алергією.
        return user.getHaveAllergy()
    } else {

        // Алергії немає, повертає "Nothing".
        return "Nothing"
    }
}

// Функція, яка повертає бюджет користувача після операції покупки.
module.exports.budgetAfterPay = function budgetAfterPay() {

    // Передаємо значення бюджета після операції покупки у user.js (-> user/user.js).
    user.setBudgetAfterPay(user.getBudget() - user.getFullPayment())

    // Повертаємо значення бюджета після покупки.
    return user.getBudgetAfterPay()
}

// Функція перевірки, чи користувач зможе замовити їжу. Якщо бюджет після покупки менше 0, то повертає false.
module.exports.canBuy = function canBuy() {

    // Перевірка бюджету.
    if (exports.budgetAfterPay() >= 0) {

        // Повертає true, якщо бюджет більше 0.
        return true
    } else {

        // Повертає true, якщо бюджет менше 0.
        return false
    }
}

// Остання функція у userInfo.js. Перевіряє, чи є алергія, чи є кошти для покупки. Якщо щось одне з двох не проходить, то зупиняє подальше виконання програми.
module.exports.start = function start() {

    // Перевірка, чи збігаються дві умови, алергія і бюджет після покупки.
    if (exports.haveAllergy() == "Nothing" && exports.canBuy() == true) {

        // Вітання, якщо умови підходять.
        console.log("You can buy food in our Restaurant !")
        return true
    } else {

        // Важливо !
        // Якщо в користувача є алергія на страву, то його кошти не віднімаються, в бюджет кошти не додаються.
        // Але інградієнти, які були затрачені на страву - віднімаються зі складу.
        // Працює тільки у випадку, якщо користувач 1.
        if (exports.haveAllergy() !== "Nothing" && exports.canBuy() == true) {

            operationWithWarehouse.Calculate()
            // operationWithBudget._removeFromBudget(user.getPrice())
        }

        // Важливо !
        // Якщо в користувача немає алергії, але і немає коштів, то програма зупиняє виконання.
        // Як мінімум, одна з умов, не підходить. Програма зупиняє подальше виконання.

        // Записуємо в логи інформацію про те, що в користувача алергія.
        operationWithLogs.addLogs("У користувача алергія.")
        operationWithLogs.writeLogs()

        // Інформація про вихід з програми.
        // systemCommands.EXIT("У користувача є алергія, або немає коштів на замовлення.")

        return false
    }
}