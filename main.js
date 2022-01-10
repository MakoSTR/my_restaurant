const user = require("./user/user")
const checkUserData = require("./user/checkUserData")
const getIngradients = require("./menu/getIngradients")
const getPrice = require("./menu/getPrice")
const userInfo = require("./output/userInfo")
const operationWithBudget = require("./budget/operationWithBudget")
const operationWithWarehouse = require("./warehouse/operationWithWarehouse")
const eating = require("./output/eating")
const audit = require("./restaurantLogs/operationWithLogs")
const accessRights = require("./accessRights/accessRights")
const operationWithVisits = require("./visits/operationWithVisits")
const operationWithDailyTax = require("./taxes/operationWithDailyTax");
const fs = require("fs");
const systemCommands = require("./systemCommands/systemCommands")
const admin = require("./admin/admin")
const customersBudget = require('./resources/customersBudget.json');
const customersAllergies = require('./resources/customersAllergies.json');
const auditAction = require("./restaurantLogs/audit");
const trashService = require("./services/trashService");
const baseIngradients = require("./menu/baseIngradients")
const notBaseIngradients = require("./menu/notBaseIngradients")

const menu = require('./menu/notBaseIngradients.json');
const wasteLimit = require('./resources/configuration.json');
const operationWithLogs = require("./restaurantLogs/operationWithLogs");
const {food} = require("./user/user");

/*
------------------------------------------------------------------------------------------------
1. ГОЛОВНА ФУНКЦІЯ ПРОГРАМИ - main()
ДЛЯ ЗАПУСКУ ВИКОНУЄМО КОМАНДУ - node main
------------------------------------------------------------------------------------------------
2. ГОЛОВНА ФУНКЦІЯ ДЛЯ АДМІНІСТРАТОРА - admin()
ДЛЯ ЗАПУСКУ ВИКОНУЄМО КОМАНДУ - node admin/admin
------------------------------------------------------------------------------------------------
3. ДЛЯ ЗАПУСКУ ТЕСТУВАННЯ ПРОГРАМИ - npm test
------------------------------------------------------------------------------------------------
4. ДЛЯ ПЕРЕВІРКИ ПОКРИТТЯ ПРОГРАМИ ТЕСТАМИ - npm test -- --coverage
------------------------------------------------------------------------------------------------
*/

// operationWithDailyTax.openRestaurant()

// 1 Variant.
// Передаємо у функцію main() нового користувача по наступному прикладу.
// quantityOfPeople(["Maksym"], 1000, ["Fries"], ["Potatoes"])
// quantityOfPeople(["MaksymTwo"], 1000, ["Princess Chicken"], ["Chickenq"])
// quantityOfPeople(["2"], 1000, ["Emperor Chicken"], ["Chickens"])

// Функція, яка своїм викликом показує в консолі всі логи, які були здійснені до попереднього замовлення включно.
// if (accessRights.getAuditCommand() == true) audit.showLogs()

// 2 Variant.
// Передаємо у функцію 2ох і більше користувачів по наступному прикладу.
// quantityOfPeople(["One", "Two","Three"], [1000, 3000, 2000], ["Princess Chicken", "Princess Chicken","Princess Chicken"], [["Work"], ["Soy"],["QWe"]])

// Функція, яка своїм викликом показує в консолі всі логи, які були здійснені до попереднього замовлення включно.
// if (accessRights.getAuditCommand() == true) audit.showLogs()

// operationWithDailyTax.closeRestaurant()

// Головна функція програми. Отримуємо дані з виклику функції main() (-> 10)
function main(name, budget, food, allergy) {

    --exports.quantityOfUsers

    operationWithVisits.setVisit(name)

    var result4 = accessRights.getBuyCommand()
    if (result4 == false) {
        systemCommands.EXIT("Право на замовлення відключено.")
    }

    // Перевіряємо коректність вхідних даних.
    checkUserData.checkUser(name, budget, food, allergy)

    // Отримані параметри передаємо у user.js (-> user/user.js). Зберігаємо у файлі всі дані, а за допомогою Get отримуємо всі дані.
    user.User(name, budget, food, allergy)

    audit.addLogs(name)
    audit.addLogs(food)
    audit.writeLogs()

    // Запускаємо локальну функцію Properties().
    Properties()


    // console.log(user.getIngradients())
    // console.log(user.getPrice())

    // Передаємо виконання функції StartInfoForUser(), яка виводить базову інформацію для користувача.
    // Також вона робить базові операції і перевіряє на коректність.
    // Якщо все проходить перевірку, то винонання програми продовжується, а якщо ні - виконання зупиняється.
    // var result3 = userInfo.StartInfoForUser()
    // if (result3 == false) return

    const resultAboutAllergy = userInfo.StartInfoForUser()
    if (!resultAboutAllergy[7]) {
        const trash = trashService.getTrash();
        const ingredient = menu[food]
        trashService.trashService(wasteLimit['waste limit'], trash, 1, ingredient)

        const readyMeals = JSON.parse(fs.readFileSync("./warehouse/readyMeals.txt", {encoding: "UTF-8"}));
        const warehouseIngradients = JSON.parse(fs.readFileSync("./warehouse/warehouseIngradients.txt", {encoding: "UTF-8"}));
        const restaurantBudget = fs.readFileSync("./budget/restaurantBudget.txt", {encoding: "UTF-8"});
        const getTrash = trashService.getTrash();

        const trashCopy = {...getTrash}
        const warehouses = {
            ...readyMeals,
            ...warehouseIngradients
        };

        const message = {
            message: ` => can’t order, allergic to: ${allergy}`,
            warehouses,
            restaurantBudget,
            trash: trashCopy
        }
        auditAction.addToAudit(message);


        return false
    }

    // Функція, яка забирає зі складі всі інградієнти, які входять у страву.
    const result = operationWithWarehouse.Calculate()
    if (!result[2]) {

        const readyMeals = JSON.parse(fs.readFileSync("./warehouse/readyMeals.txt", {encoding: "UTF-8"}));
        const warehouseIngradients = JSON.parse(fs.readFileSync("./warehouse/warehouseIngradients.txt", {encoding: "UTF-8"}));
        const restaurantBudget = fs.readFileSync("./budget/restaurantBudget.txt", {encoding: "UTF-8"});
        const trash = trashService.getTrash();
        const trashCopy = {...trash}

        const warehouses = {
            ...readyMeals,
            ...warehouseIngradients
        };

        const message = {
            message: ` => Немає потрібної кількості інградієнтів.??`,
            warehouses,
            restaurantBudget,
            trash: trashCopy
        }
        auditAction.addToAudit(message);

        return false
    }
    // Функція, яка забирає з бюджету ціну страви і додає ціну разом з націнкою.
    operationWithBudget.Calculate()

    // Виводимо інформацію про користувача, а саме, його ім`я і страва, яку він замовив.
    // Демострація трапези.
    // Якщо в процесі замовлення і т.д. були проблеми, то дана функція не викликається.
    eating.eating()

    // Функція, яка записує локальні логи у файл. Потім обнуляє значення локальних логів.
    audit.writeLogs()

}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

module.exports.userWant = function userWant() {

    var result = parseInt(randomNumber(0, 101))

    if (result > 0 && result <= 50) {
        console.log("no")
        operationWithLogs.addLogs("Нічого не хоче.")
        operationWithLogs.writeLogs()
        return []
    }
    if (result > 50 && result <= 85) {
        console.log("1")
        var result2 = parseInt(randomNumber(-1, 16))
        console.log(Object.keys(baseIngradients.baseIngradients)[result2])
        operationWithLogs.addLogs("Хоче: " + Object.keys(baseIngradients.baseIngradients)[result2])
        operationWithLogs.writeLogs()
        return [Object.keys(baseIngradients.baseIngradients)[result2]]
    }
    if (result > 85 && result <= 95) {
        console.log("2")
        var result3 = parseInt(randomNumber(-1, 16))
        console.log(Object.keys(baseIngradients.baseIngradients)[result3])
        var result4 = parseInt(randomNumber(-1, 16))
        console.log(Object.keys(baseIngradients.baseIngradients)[result4])
        operationWithLogs.addLogs("Хоче: " + Object.keys(baseIngradients.baseIngradients)[result3] + " + " + Object.keys(baseIngradients.baseIngradients)[result4])
        operationWithLogs.writeLogs()
        return [
            Object.keys(baseIngradients.baseIngradients)[result3],
            Object.keys(baseIngradients.baseIngradients)[result4]
        ]
    }
    if (result > 95 && result <= 100) {
        console.log("3")
        var result5 = parseInt(randomNumber(-1, 16))
        console.log(Object.keys(baseIngradients.baseIngradients)[result5])
        var result6 = parseInt(randomNumber(-1, 16))
        console.log(Object.keys(baseIngradients.baseIngradients)[result6])
        var result7 = parseInt(randomNumber(-1, 16))
        console.log(Object.keys(baseIngradients.baseIngradients)[result7])
        operationWithLogs.addLogs("Хоче: " + Object.keys(baseIngradients.baseIngradients)[result5] + " + " +
            Object.keys(baseIngradients.baseIngradients)[result6] + " + " + Object.keys(baseIngradients.baseIngradients)[result7])
        operationWithLogs.writeLogs()
        return [
            Object.keys(baseIngradients.baseIngradients)[result5],
            Object.keys(baseIngradients.baseIngradients)[result6],
            Object.keys(baseIngradients.baseIngradients)[result7]
        ]
    }
}

module.exports.helpFLAG = false

module.exports.QUANTITY = 0

module.exports.helpMode = false

module.exports.checkInputFile = function checkInputFile() {

    exports.helpMode = true

    var resultWhoNeedHelp = fs.readFileSync(__dirname + "/output/whoNeedHelp.txt")
    var resultWhoCanHelp = fs.readFileSync(__dirname + "/output/whoCanHelp.txt")

    console.log(Object.values(JSON.parse((resultWhoNeedHelp)))[0])
    resultWhoNeedHelp = Object.values(JSON.parse((resultWhoNeedHelp)))[0]
    console.log(Object.values(JSON.parse((resultWhoCanHelp)))[0])
    resultWhoCanHelp = Object.values(JSON.parse((resultWhoCanHelp)))[0]

    for (var i = 0; i < Object.keys(resultWhoCanHelp).length; i++) {
        console.log(`Help from: ${Object.keys(resultWhoCanHelp)[i]} | He has: ${Object.values(resultWhoCanHelp)[i]} money`)

        for (var p = 0; p < Object.keys(resultWhoNeedHelp).length; p++) {
            console.log(`Name: ${Object.keys(resultWhoNeedHelp)[p]} | Food: ${Object.values(resultWhoNeedHelp)[p][0]} | Help: ${Object.values(resultWhoNeedHelp)[p][1]}`)

            value = Object.values(resultWhoCanHelp)[i] - Object.values(resultWhoNeedHelp)[p][1] * -1
            if (value > 0 && resultWhoNeedHelp[Object.keys(resultWhoNeedHelp)[p]][1] < 0) {
                resultWhoCanHelp[Object.keys(resultWhoCanHelp)[i]] -= Object.values(resultWhoNeedHelp)[p][1] * -1
                resultWhoNeedHelp[Object.keys(resultWhoNeedHelp)[p]][1] *= -1
                operationWithLogs.addLogs(`-----------------------------------`)
                operationWithLogs.addLogs(`Користувачу позичили: ${resultWhoNeedHelp[Object.keys(resultWhoNeedHelp)[p]][1]}`)
                operationWithLogs.writeLogs()
                exports._quantityOfPeople([Object.keys(resultWhoNeedHelp)[p]], [Object.values(resultWhoNeedHelp)[p][0]], false, Object.values(resultWhoNeedHelp)[p][1])
                operationWithLogs.addLogs(`-----------------------------------`)
                operationWithLogs.writeLogs()
            }
        }
    }

    console.log(resultWhoCanHelp)
    console.log(resultWhoNeedHelp)

}

// Функція, яка встановлює основні знанення користувача.
// Тобто, інградієнти, які входять у страву.
// Ціна за страву.
// Чи є у нього алергія.
function Properties() {

    // Функцію user.getFood() зі стравою передаємо у функцію ingradients() (-> menu/getIngradients.js), яка повертає нам масив зі всіма інградієнтами, які входять у страву.
    var ingradients = getIngradients.ingradients(user.getFood())

    // Отриманий масив з інградієнтами, які входять у страву передаємо у user.js (-> user/user.js).
    user.setIngradients(ingradients)

    // Отриманий масив передаємо у функцію price() (-> menu/getPrice.js), яка повертаємо нам ціну всіх інградієнтів, які входять у страву.
    var price = getPrice.price(user.getIngradients())

    // Отриману ціну передаємо у user.js (-> user/user.js).
    user.setPrice(price)

    // Передаємо у функцію allergyCheck() (-> user/checkUserData.js) 2 масива. 1ий містить алергії, які має користувач. 2ий з інградієнтами, які входять у страву.
    var allergy = checkUserData.allergyCheck(user.getAllergy(), user.getIngradients())

    // Отриманий масив з алергією, яку має користувач, передаємо у метод user.js (-> user/user.js).
    user.setHaveAllergy(allergy)
}

module.exports._quantityOfPeople = function _quantityOfPeople(name, food, pooled, help) {
    quantityOfPeople([name], [food], pooled, help)
}

module.exports.POOLED = false

module.exports.quantityOfUsers = 0

function checkUserFoodWhenRecommdCommand(food, name) {

    food = food[0].split('-')

    var recommendedFood = {}
    var ingradientsForRecommendedFood = {}

    for (var i = 0; i < Object.keys(JSON.parse(JSON.stringify(notBaseIngradients.notBaseIngradients))).length; i++) {
        var ingradients = getIngradients.ingradients(Object.keys(JSON.parse(JSON.stringify(notBaseIngradients.notBaseIngradients)))[i])

        for (var y = 0; y < ingradients.length; y++) {

            for (var j = 0; j < food.length; j++) {

                if (ingradients[y] == food[j]) {

                    // recommendedFood.add(Object.keys(JSON.parse(JSON.stringify(notBaseIngradients.notBaseIngradients)))[i])
                    recommendedFood[Object.keys(JSON.parse(JSON.stringify(notBaseIngradients.notBaseIngradients)))[i]] = getPrice.price(ingradients)
                    ingradientsForRecommendedFood[Object.keys(JSON.parse(JSON.stringify(notBaseIngradients.notBaseIngradients)))[i]] = ingradients
                    // ingradientsForRecommendedFood.push(ingradients)
                    // priceForRecommendedFood.push(getPrice.price(ingradients))
                }
            }
        }
    }

    var _recommendedFood = Object.fromEntries(
        Object.entries(recommendedFood).sort(([, a], [, b]) => b - a)
    )


    var removeFoodsFromArray = new Set

    for (var k = 0; k < Object.keys(_recommendedFood).length; k++) {
        var budget = customersBudget[name];
        var allergy = customersAllergies[name];

        if (budget >= Object.values(_recommendedFood)[k]) {

            for (var g = 0; g < allergy.length; g++){

                for (var t = 0; t < Object.values(ingradientsForRecommendedFood[Object.keys(_recommendedFood)[k]]).length ; t++) {
                    if(Object.values(ingradientsForRecommendedFood[Object.keys(_recommendedFood)[k]])[t] == allergy[g]){
                        removeFoodsFromArray.add(Object.keys(_recommendedFood)[k])
                    }
                }
            }
        }

    }

    for (var q = 0; q < Object.keys(_recommendedFood).length; q++) {
        for (var w = 0; w < Array.from(removeFoodsFromArray).length; w++) {

            if (Object.keys(_recommendedFood)[q] == Array.from(removeFoodsFromArray)[w]) {
                delete _recommendedFood[Array.from(removeFoodsFromArray)[w]]
            }
        }
    }


    operationWithLogs.addLogs("Рекомендовані страви: " + Object.keys(_recommendedFood))
    operationWithLogs.addLogs("Готуємо " + Object.keys(_recommendedFood)[0])
    operationWithLogs.writeLogs()

    return Object.keys(_recommendedFood)[0]
}

// Функція, яка перевіряє, скільки замовляє користувачів.
function quantityOfPeople(name, food, pooled, help, recommend) {

    console.log(name)
    // process.exit(-1)

    if (recommend == true) {
        food = checkUserFoodWhenRecommdCommand(food, name)
    }

    if (pooled === true) {
        exports.POOLED = true
    }

    // Якщо більше 1 користувач.
    if (name.length == 1) {
        var budget = customersBudget[name];
        const allergy = customersAllergies[name];

        if (help > 0) {
            budget += help
            console.log("@BUDGET@: " + budget)
        }

        main(name, budget, food, allergy)
    } else {

        exports.quantityOfUsers = name.length

        const budget = name.map(e => customersBudget[e]);
        const allergy = name.map(e => customersAllergies[e]);
        if (accessRights.getTableCommand() == false) return

        // Якщо більше 1го користувача.

        // Створюємо пустий масив.
        var ingradientsForAllFood = []

        // Створюємо змінну, по дефолту - true. Якщо в результаті залишається true, то виконання програми продовжується, в іншому випадку здійснюється вихід з програми.
        var haveAllergies = true

        // Створюємо змінну, по дефолту - true. Якщо в результаті залишається true, то виконання програми продовжується, в іншому випадку здійснюється вихід з програми.
        var haveMoney = true

        // Перебираємо всі інградієнти, які входять у страву N-го користувача.
        for (var i = 0; i < name.length; i++) {
            // Отримані інградієнти записуємо у масив ingradientsForAllFood[].
            // Важливо ! Інградієнти записуються у вигляді масиву.
            ingradientsForAllFood.push(getIngradients.ingradients(food[i]))

            // Створюємо змінну price, в яку записуємо ціну страви з націнкою.
            var price = Math.round(getPrice.price(ingradientsForAllFood[i]) * userInfo.PERCENT)

            // Перевіряємо, чи бюджет користувача більший за вартість страви.
            if (budget[i] < price) {

                // Якщо бюджет користувача більший, за вартість страви, то змінну залишається - true, в іншому випадку ставимо - false.
                haveMoney = false
            }
        }

        // В масиві ingradientsForAllFood[] зберігаються масиви з інградієнтами, яких потрібно об`єднати в один.
        var _ingradientsForAllFood = []

        // Перебираємо масиви, які входять в ingradientsForAllFood[].
        for (var i = 0; i < ingradientsForAllFood.length; i++) {

            // Процес об`єднання массивів в один.
            _ingradientsForAllFood = _ingradientsForAllFood.concat(ingradientsForAllFood[i])
        }

        // Перебираємо алергії користувачів. Чи входять вони у масив з інградієнтами, які в свою чергу входять у масив інградієнтів страв, які вони замовили.
        for (var i = 0; i < name.length; i++) {

            // Перевірка на алергію. Результат записуємо у змінну result [].
            var result = checkUserData.allergyCheck(allergy[i], _ingradientsForAllFood)

            // Якщо масив з результатом більше за 1, то це означає, що в ньому є алергія.
            // Тому змінній haveAllergies присвоюємо - false.
            // При такій умові виконання програми завершується.
            if (result.length >= 1) {
                haveAllergies = false
            }
        }

        // Якщо алергій у користувачів не було, то змінна haveAllergies - true.
        // Якщо бюджет користувача дозволяє замовити страву, то змінна haveMoney - true.
        // Виконання продовжується, якщо всі змінні - true.
        if (haveAllergies == true && haveMoney == true) {

            // Перевірка кількості користувачів.
            for (var i = 0; i < name.length; i++) {

                // Якщо все добре, то передаємо кожного користувача з його даними у функцію main().
                main(name[i], budget[i], food[i], allergy[i])
            }
            // Якщо в одного зі всіх користувачів була алергія, то виконання програми завершується.
        } else {
            console.log("EXIT: main.js/48")
        }
    }    // operationWithDailyTax.closeRestaurant()
}

module.exports = quantityOfPeople;