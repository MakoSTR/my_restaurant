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
const tipsService = require('../tips/tips')
const tippingTax = require("../taxes/tippingTax")
const main = require("../main")
const baseIngradients = require("../menu/baseIngradients")

var usersBudgets = {}
// var usersFood = {}
var whoNeedHelp = {}
var whoCanHelp = {}

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
        console.log("Your budget after pay: " + exports.budgetAfterPay())
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

// function randomNumber(min, max) {
//     return Math.random() * (max - min) + min;
// }

// Функція, яка повертає бюджет користувача після операції покупки.
module.exports.budgetAfterPay = function budgetAfterPay() {

    var userIngr = user.getIngradients()
    var userWnt = main.userWant()

    console.log(userIngr)
    console.log(userWnt)

    var quantityOfWant = 0
    var quantityOfWant_Ingradients = []

    for (var x = 0; x < userIngr.length; x++) {
        for (var z = 0; z < userWnt.length; z++) {
            if (userIngr[x] == userWnt[z]) {
                quantityOfWant_Ingradients.push(userWnt[z])
                quantityOfWant += 1
            }
        }
    }

    if (quantityOfWant > 0) {
        operationWithLogs.addLogs(`Інградієнти, які хотів користувач >${quantityOfWant_Ingradients}<, входять у страву, яку він замовив, тому чайові будуть збільшені у ${quantityOfWant} разів.`)
        operationWithLogs.writeLogs()
    } else {
        operationWithLogs.addLogs("Інградієнти, які хотів користувач, не входять у страву, яку він замовив.")
        operationWithLogs.writeLogs()
    }

    console.log()

    let restOfUserBudget = user.getBudget() - user.getFullPayment()
    let tipsValue = +parseFloat((tipsService.getTipsValue() / 100) * parseFloat(user.getFullPayment().toFixed(2)));
    if (quantityOfWant > 0) {
        operationWithLogs.addLogs("Очікувані чайові: " + tipsValue)
        switch (quantityOfWant) {
            case 1: {
                tipsValue = tipsValue * 2
                break
            }
            case 2: {
                tipsValue = tipsValue * 3
                break
            }
            case 3: {
                tipsValue = tipsValue * 4
                break
            }
            default: {
                console.log("ERROR")
            }
        }
        operationWithLogs.addLogs("Фактичні чайові: " + tipsValue)
        operationWithLogs.writeLogs()
    }
    usersBudgets[user.getName()] = parseFloat(restOfUserBudget.toFixed(1))
    // usersFood[user.getName()] = user.getFood()
    if (restOfUserBudget < 0 && main.helpMode == true){
        operationWithLogs.addLogs(`Потрібно доплатити за замовлення: ${restOfUserBudget * -1}`)
        operationWithLogs.addLogs(`Потрібно доплатити чайові: ${tipsValue}`)
        operationWithLogs.writeLogs()
        var value = user.getBudget() + tipsValue
        value = value + restOfUserBudget * -1
        user.setBudget(value)
    }
    if (restOfUserBudget < 0 && main.helpMode == false) {
        operationWithLogs.addLogs("На замовлення не вистачає: " + restOfUserBudget)
        operationWithLogs.writeLogs()
        whoNeedHelp[user.getName()] = [user.getFood(), restOfUserBudget]
        main.QUANTITY += 1
        fs.writeFileSync(__dirname + "/whoNeedHelp.txt", JSON.stringify({
            whoNeedHelp
        }))
        user.setBudgetAfterPay(-1)
        return
    }

    audit.addLogs("Чайові: " + tipsValue)
    audit.addLogs("Податок на чайові: " + tipsValue / 100 * tippingTax.tippingTax)
    audit.writeLogs()
    operationWithBudget.removeFromBudget(parseFloat(tipsValue / 100 * tippingTax.tippingTax))
    // console.log("REMOVE: " + tipsValue / 100 * tippingTax.tippingTax)
    console.log("TIPS: " + tipsValue)
// Передаємо значення бюджета після операції покупки у user.js (-> user/user.js).
    if (restOfUserBudget >= tipsValue) {
        tipsValue = tipsValue;
        let setBudgetAfterPay = user.setBudgetAfterPay(restOfUserBudget - tipsValue);
        whoCanHelp[user.getName()] = [user.getBudgetAfterPay()]
        fs.writeFileSync(__dirname + "/whoCanHelp.txt", JSON.stringify({
            whoCanHelp
        }))
        return +parseFloat(setBudgetAfterPay).toFixed(2);
    } else if (restOfUserBudget < 0) {
        tipsValue = restOfUserBudget
        let setBudgetAfterPay = user.setBudgetAfterPay(restOfUserBudget - tipsValue)
        // whoCanHelp[user.getName()] = [user.getBudgetAfterPay()]
        // fs.writeFileSync(__dirname + "/whoCanHelp.txt", JSON.stringify({
        //     whoCanHelp
        // }))
        return +parseFloat(setBudgetAfterPay).toFixed(2)

    }
    //  user.getBudgetAfterPay()
    // return
}

var removeTips = 0

// module.exports.budgetAfterPay = function budgetAfterPay() {
//
//     // Передаємо значення бюджета після операції покупки у user.js (-> user/user.js).
//     user.setBudgetAfterPay(user.getBudget() - user.getFullPayment())
//
//     // Повертаємо значення бюджета після покупки.
//     console.log(user.getBudgetAfterPay() + " - @@@@@@@@@@@@@@@@@@@")
//     return user.getBudgetAfterPay()
// }

// Функція перевірки, чи користувач зможе замовити їжу. Якщо бюджет після покупки менше 0, то повертає false.
module.exports.canBuy = function canBuy() {
    // Перевірка бюджету.
    if (user.getBudgetAfterPay() >= 0) {

        // Повертає true, якщо бюджет більше 0.
        return true
    } else {

        // Повертає true, якщо бюджет менше 0.
        return false
    }
}

var addUsers = {}

// Остання функція у userInfo.js. Перевіряє, чи є алергія, чи є кошти для покупки. Якщо щось одне з двох не проходить, то зупиняє подальше виконання програми.
module.exports.start = function start() {

    // Перевірка, чи збігаються дві умови, алергія і бюджет після покупки.
    if (exports.haveAllergy() == "Nothing" && exports.canBuy() == true) {

        // Вітання, якщо умови підходять.
        console.log("You can buy food in our Restaurant !")

        operationWithLogs.addLogs("Бюджет до: " + user.getBudget())
        // user.setBudgetAfterPay(user.getBudgetAfterPay() - removeTips)
        operationWithLogs.addLogs("Бюджет після: " + user.getBudgetAfterPay())
        operationWithLogs.writeLogs()

        // if (Object.keys(whoNeedHelp).length > 0) {
        //
        //     console.log(whoNeedHelp)
        //     console.log(usersBudgets)
        //
        //     for (var j = 0; j < Object.keys(whoNeedHelp).length; j++) {
        //
        //         var result = usersBudgets[Object.keys(usersBudgets)[Object.keys(usersBudgets).length - 1]] - usersBudgets[Object.keys(whoNeedHelp)[j]] * -1
        //         if (result > 0) {
        //             usersBudgets[Object.keys(usersBudgets)[Object.keys(usersBudgets).length - 1]] = result
        //             console.log(Object.keys(whoNeedHelp)[j], Object.values(whoNeedHelp)[j], false, usersBudgets[Object.keys(whoNeedHelp)[j]] * -1)
        //
        //             var name = Object.keys(whoNeedHelp)[j]
        //             var food = Object.values(whoNeedHelp)[j]
        //             var help = usersBudgets[Object.keys(whoNeedHelp)[j]] * -1
        //
        //
        //             addUsers[name] = [food, help]
        //
        //             fs.writeFileSync(__dirname + "/_input.txt", JSON.stringify({
        //                 addUsers
        //             }))
        //
        //             main.QUANTITY += 1
        //             main.helpFLAG = true
        //
        //             console.log(usersBudgets)
        //             console.log(whoNeedHelp)
        //
        //
        //             operationWithLogs.addLogs("---------------------------------------------")
        //             operationWithLogs.writeLogs()
        //
        //             operationWithLogs.addLogs("У одного з попередніх користувачів не було коштів на замовлення.")
        //             operationWithLogs.writeLogs()
        //             operationWithLogs.addLogs("У користувача, який замовляє на даний момент є кошти, щоб нам позичити.")
        //             operationWithLogs.writeLogs()
        //             operationWithLogs.addLogs(`Забираємо у користувача ${usersBudgets[Object.keys(usersBudgets)[Object.keys(usersBudgets).length - 1]]} суму, яку нам не вистачає: ` + help)
        //             operationWithLogs.writeLogs()
        //
        //             operationWithLogs.addLogs("---------------------------------------------")
        //             operationWithLogs.writeLogs()
        //
        //         }
        //     }
        //     whoNeedHelp = {}
        // }

        if (main.quantityOfUsers == 0){

            var usersBudgets = {}
            var whoNeedHelp = {}
            var whoCanHelp = {}

            main.checkInputFile()
        }

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
        operationWithLogs.addLogs("У користувача алергія, або немає коштів.")
        operationWithLogs.writeLogs()

        // Інформація про вихід з програми.
        // systemCommands.EXIT("У користувача є алергія, або немає коштів на замовлення.")

        // if (main.POOLED === true) {
        //     console.log("TRUE")
        //
        //     console.log(usersBudgets)
        //     // console.log(whoNeedHelp)
        //
        //     if (exports.haveAllergy() == "Nothing" && exports.canBuy() == false) {
        //
        //         for (var i = 0; i < Object.keys(usersBudgets).length; i++) {
        //
        //             whoNeedHelp[Object.keys(usersBudgets)[i]] = user.getFood()
        //             // console.log(whoNeedHelp)
        //
        //             if (Object.values(usersBudgets)[i] > 0) {
        //
        //                 var canHelp = Object.values(usersBudgets)[i] - Object.values(usersBudgets)[Object.values(usersBudgets).length - 1] * -1
        //
        //                 if (canHelp > 0) {
        //
        //                     console.log("CAN HELP")
        //                     console.log(canHelp)
        //
        //                     user.setBudget(user.getBudget() + Object.values(usersBudgets)[Object.values(usersBudgets).length - 1] * -1)
        //                     console.log(user.getBudget())
        //
        //                     operationWithLogs.addLogs("---------------------------------------------")
        //                     operationWithLogs.writeLogs()
        //                     operationWithLogs.addLogs("У користувача немає коштів на замовлення, але є змога позичити в друга.")
        //                     operationWithLogs.writeLogs()
        //                     operationWithLogs.addLogs(`Забираємо у користувача ${Object.keys(usersBudgets)[i]} суму, яку нам не вистачає: ` + Object.values(usersBudgets)[Object.values(usersBudgets).length - 1])
        //                     operationWithLogs.addLogs("Наш бюджет після позики: " + user.getBudget())
        //                     operationWithLogs.writeLogs()
        //                     operationWithLogs.addLogs("---------------------------------------------")
        //                     operationWithLogs.writeLogs()
        //
        //                     console.log("@")
        //                     usersBudgets[Object.keys(usersBudgets)[i]] = usersBudgets[Object.keys(usersBudgets)[i]] - Object.values(usersBudgets)[Object.values(usersBudgets).length - 1] * -1
        //                     console.log(usersBudgets)
        //
        //                     exports.budgetAfterPay()
        //
        //                     return true
        //                 }
        //             }
        //         }
        //     }
        // }

        if (main.quantityOfUsers == 0){

            var usersBudgets = {}
            var whoNeedHelp = {}
            var whoCanHelp = {}

            main.checkInputFile()
        }

        return false
    }
}