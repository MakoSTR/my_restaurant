const warehouseIngradients = require("./warehouseIngradients")
const user = require("../user/user")
const fs = require("fs");
const readyMeals = require("./readyMeals")
const audit = require("../restaurantLogs/operationWithLogs")
const notBaseIngradients = require("../menu/notBaseIngradients");
const systemCommands = require("../systemCommands/systemCommands")
const operationWithTotalQuantityOfAllInWarehouse = require("./operationWithTotalQuantityOfAllInWarehouse");
const quantityIngradientsInWarehouse = require("./quantityIngradientsInWarehouse");
const quantityReadyMealsInWarehouse = require("./quantityReadyMealsInWarehouse");
const buyReadyMeals = require("../admin/buyReadyMeals")
const operationWithLogs = require("../restaurantLogs/operationWithLogs");
const operationWithBudget = require("../budget/operationWithBudget")
const baseIngradients = require("../menu/baseIngradients");
const getIngradients = require("../menu/getIngradients")
const operationWithChanceToSpoil = require("./operationWithChanceToSpoil")
const operationWithWaste = require("./operationWithWaste")
const maxPriceForAFood = require("./maxPriceForAFood")
const restaurantBudget = require("../budget/restaurantBudget")

// Функція, яка викликається, щоб забрати інградієнти зі складу, які входять у страву, яку замовив користувач.
module.exports.Calculate = function Calculate() {

    // Якщо страва, яку замовив користувач, є у наявності на складі вже готова, то беремо її, а інградієнти не забираємо.
    if (readyMeals.readyMeals.hasOwnProperty(user.getFood()) && readyMeals.readyMeals[user.getFood()] >= 1) {

        // Передаємо виконання функції, яка беспосередньо забирає страву зі складу.
        exports.removeFoodFromReadyMeals()

        // Записуємо в логи інформацію про те, що ми беремо готову страву зі складу.
        operationWithLogs.addLogs("Беремо готову страву.")
        operationWithLogs.writeLogs()

        // Повертаємо страву, яку замовив користувач і її кількість на складі готових страх.
        return [user.getFood(), readyMeals.readyMeals[user.getFood()]]
    } else {

        // Записуємо в логи інфомарцію про те, що ми беремо інградієнти зі складу.
        operationWithLogs.addLogs("Беремо інградієнти.")
        operationWithLogs.writeLogs()

        // Передаємо виконання функції, яка беспосередньо забирає інградієнти і готові страви зі складу.
        exports.removeIngradientsFromWarehouse()

        // Отримуємо алергію користувача.
        var result2 = user.getHaveAllergy()

        // Передаємо результат функції, яка додає страву на склад.
        exports.addFood(result2)

        // Повертаємо страву, яку замовив користувач та інградієнти на складі.
        return [readyMeals.readyMeals, warehouseIngradients.warehouseIngradients]
    }
}

// Функція, яка додає страву на склад.
module.exports.addFood = function addFood(result2) {

    // Якщо в користувача є алергія, то продовжуємо виконання.
    if (result2.length > 0) {

        // Перевіряємо, чи є місце на складі місце для додавання страви, яку замовив користувач.
        var result = operationWithTotalQuantityOfAllInWarehouse.checkTotalQuantity(quantityIngradientsInWarehouse.getTotalQuantityOfIngradients(), quantityReadyMealsInWarehouse.getTotalQuantityOfReadyMeals())

        // Якщо місце є, то продовжуємо виконання.
        if (result === true) {

            // Якщо готових страв залишилось 0 на складі, то інградієнти за страву віднімаються, але додається 1 готова страва.
            if (readyMeals.readyMeals[user.getFood()] == 0) {

                if (user.getFullPayment() >= maxPriceForAFood.maxPriceForAFood) {

                    // Функція, яка додає страву, яку замовив користувач.
                    buyReadyMeals.addReadyMeals([user.getFood()], [1])

                    // Записуємо в логи інформацію, що витрачені інградієнти не втрачаються, а зберігаються на складі.
                    operationWithLogs.addLogs("Через алергію додаємо готову страву на склад.")
                    operationWithLogs.writeLogs()

                    // Віднімаємо з бюджета 25% за готування страви.
                    // upd: Не віднімаємо ціну, тому що ми додаємо її на склад інградієнтів.
                    // Все таки віднімаємо 25% від ціни страви.
                    operationWithBudget._removeFromBudget(user.getPrice() * 0.25)

                    return readyMeals.readyMeals
                } else {

                    operationWithBudget._removeFromBudget(user.getPrice())

                    return restaurantBudget.budget
                }
            }
        }
    }
}

// Функція, яка перевіряє залишкову кількість інградієнтів.
module.exports.checkIngradients = function checkIngradients(ingradient) {

    // Перевірка кількості інградієнтів. Якщо залишок менше 0, то зупиняємо виконання програми.
    if (ingradient < 0) {

        // Записуємо інформацію в логи про те, що немає інградієнтів на складі для замовлення.
        operationWithLogs.addLogs("Немає потрібної кількості інградієнтів.")
        operationWithLogs.writeLogs()

        // Якщо на складі немає потрібної кількості інградієнтів, то виходимо з програми.
        systemCommands.EXIT("Немає потрібної кількості інградієнтів.")

        // Повертаємо false, щоб протестува даний етап програми.
        return false
    } else {

        // Повертаємо кількість інградієнтів назад. Спрацьовує при успішній перевірці інградієнтів на складі. Означає, що потрібний інградієнт в наявності.
        return ingradient
    }
}

// Функція, яка отримує локальне значення інградієнтів на складі і записує фізично їх у файл.
module.exports.addIngradientsInWarehouse = function addIngradientsInWarehouse(value) {

    // Процес перезапису нового складу на старий.
    exports.writeFile_addIngradientsInWarehouse(value)

    // Повертаємо нове значення складу з інградієнтами.
    return warehouseIngradients.warehouseIngradients
}

module.exports.writeFile_addIngradientsInWarehouse = function addIngradientsInWarehouse(value) {

    fs.writeFileSync(__dirname + "/warehouseIngradients.txt", JSON.stringify(value))
}

// Функція, яка забирає страву з readyMeals.txt, щоб не витрачати інградієнти.
module.exports.removeFoodFromReadyMeals = function removeFoodFromReadyMeals() {

    // Віднімаємо в readyMeals.txt страву, яку замовив користувач.
    readyMeals.readyMeals[user.getFood()] = readyMeals.readyMeals[user.getFood()] - 1

    // Перезаписуємо кількість готових страв у readyMeals.txt.
    exports.writeFile_removeFoodFromReadyMeals()

    // Повертаємо нове значення кількості готової страви, яку замовив користувач.
    return readyMeals.readyMeals[user.getFood()]
}

// Функція, яка записує нове значення готових страв у файл.
module.exports.writeFile_removeFoodFromReadyMeals = function writeFile_removeFoodFromReadyMeals() {

    // Перезаписуємо значення готових страв у файл.
    fs.writeFileSync(__dirname + "/readyMeals.txt", JSON.stringify(readyMeals.readyMeals))
}


// Функція, яка забирає інградієнти і готові страви зі складу.
module.exports.removeIngradientsFromWarehouse = function removeIngradientsFromWarehouse() {

    // Викликаємо функцію, за допомогою якої отримуємо 2 масива.
    // 1ий масив містить всі інградієнти, які входять у склад страви.
    // 2ий масив містить всі готові страви, які входять у склад страви.
    var result = getIngradients.getReadyMeals(user.getFood())

    // Якщо 1ий масив більший за 0, тобто, не пустий, то виконуємо наступні команди.
    if (result[0].length > 0) {

        // Перебираємо кожен елемент за 1го масива.
        for (var i = 0; i < result[0].length; i++) {

            // Якщо кожен елемент з 1го масива входить у список базових інградієнтів, то виконуємо наступні команди.
            if (baseIngradients.baseIngradients.hasOwnProperty(result[0][i])) {

                // Віднімаємо значення вибраного інградієнта на 1.
                warehouseIngradients.warehouseIngradients[result[0][i]] = warehouseIngradients.warehouseIngradients[result[0][i]] - 1
                // Перевіряємо, чи є інградієнт на складі для подальшого виконання замовлення.
                exports.checkIngradients(warehouseIngradients.warehouseIngradients[result[0][i]])
                // Перевіряємо інградієнт на псування.
                var result4 = operationWithChanceToSpoil.chackChanceToSpoil()
                // Якщо він зіпсований, то виконуємо наступні комаанди.
                if (result4 >= 1) {

                    // Віднімаємо кількість зіпсованих інградієнтів на складі.
                    warehouseIngradients.warehouseIngradients[result[0][i]] = warehouseIngradients.warehouseIngradients[result[0][i]] - result4
                    // Записуємо інградієнти і їх кількість, які були зіпсовані.
                    operationWithWaste.addToWaste([result[0][i], result4])
                }
                // Перевіряємо, чи є інградієнт на складі для подальшого виконання замовлення.
                exports.checkIngradients(warehouseIngradients.warehouseIngradients[result[0][i]])
            }
        }
    }

    // Якщо 2ий масив більший за 0, тобто, не пустий, то виконуємо наступні команди.
    if (result[1].length > 0) {

        // Перебираємо кожен елемент з 2го масива.
        for (var j = 0; j < result[1].length; j++) {

            // Якщо кожен елемент з 2го масива входить у список готових страв, то виконуємо наступні команди.
            if (notBaseIngradients.notBaseIngradients.hasOwnProperty(result[1][j])) {

                // Якщо обрана страва є на складі, то виконуємо наступну команду.
                if (readyMeals.readyMeals[result[1][j]] > 0) {

                    // Якщо вибраної страви на складі більше 0, то забираємо її.
                    readyMeals.readyMeals[result[1][j]] = readyMeals.readyMeals[result[1][j]] - 1
                } else {

                    // Якщо вибраної страви немає на складі, то отримуємо всі базові інградієнти, які входять у її склад.
                    var result2 = getIngradients.ingradients(result[1][j])

                    // Якщо кількість елементів більша за 0, то виконуємо наступні команди.
                    if (result2.length > 0) {

                        // Перебираємо кожен базовий інградієнт.
                        for (var k = 0; k < result2.length; k++) {

                            // Якщо елемент входить у список базових інградієнтів, то виконуємо наступні команди.
                            if (baseIngradients.baseIngradients.hasOwnProperty(result2[k])) {

                                // Віднімаємо 1 інградієнт зі складу.
                                warehouseIngradients.warehouseIngradients[result2[k]] = warehouseIngradients.warehouseIngradients[result2[k]] - 1
                                // Перевіряємо, чи є інградієнт у наявності для подальшого виконання замовлення.
                                exports.checkIngradients(warehouseIngradients.warehouseIngradients[result[0][i]])
                                // Перевіряємо шанс псування страви.
                                var result3 = operationWithChanceToSpoil.chackChanceToSpoil()
                                // Якщо шанс зіпсованих страв більше за 1, то виконуємо наступні команди.
                                if (result3 >= 1) {

                                    // Віднімаємо кількість зіпсованих страв зі складу.
                                    warehouseIngradients.warehouseIngradients[result2[k]] = warehouseIngradients.warehouseIngradients[result2[k]] - result3
                                    // Записуємо, які саме і скільки інградієнтів було зупсовано.
                                    operationWithWaste.addToWaste([result2[k], result3])
                                }
                                // Перевіряємо, чи є інградієнт у наявності для подальшого виконання замовлення.
                                exports.checkIngradients(warehouseIngradients.warehouseIngradients[result2[k]])
                            }
                        }
                    }
                }
            }
        }
    }

    // Викликаємо функцію для перезапису файлу з готовими стравами.
    exports.writeFile_removeFoodFromReadyMeals()
    // Викликаємо функцію для перезапису файлу з інградієнтами.
    exports.writeFile_removeIngradientsFromWarehouse()

    // Повертаємо значення складу інградієнтів і готових страв для тестування.
    return [warehouseIngradients.warehouseIngradients, readyMeals.readyMeals]
}

// Функція, яка записує нове значення інградієнтів складу у файл.
module.exports.writeFile_removeIngradientsFromWarehouse = function writeFile_removeIngradientsFromWarehouse() {

    // Перезаписуємо значення інградієнтів на складі у файл.
    fs.writeFileSync(__dirname + "/warehouseIngradients.txt", JSON.stringify(warehouseIngradients.warehouseIngradients))
}

// Функція, яка записує нове значення готових страв у файл.
module.exports.addReadyMeals = function addReadyMeals(value) {

    // Процес перезапису нового складу на старий.
    exports.writeFile_addReadyMeals(value)

    // Повертаємо нове значення складу з готовими стравами.
    return readyMeals.readyMeals
}

// Функція, яка беспосередньо записує дані у файл.
module.exports.writeFile_addReadyMeals = function writeFile_addReadyMeals(value) {

    // Процес перезапису нового складу на старий.
    fs.writeFileSync(__dirname + "/readyMeals.txt", JSON.stringify(value))
}