const ingradients = require("./allowableQuantityInStock/ingradients")
const warehouseIngradients = require("./warehouseIngradients")
const fs = require("fs");
const operationWithTotalQuantityOfAllInWarehouse = require("./operationWithTotalQuantityOfAllInWarehouse");
const quantityReadyMealsInWarehouse = require("./quantityReadyMealsInWarehouse")
const systemCommands = require("../systemCommands/systemCommands");
const audit = require('../restaurantLogs/audit');
const trashService = require('../services/trashService');

// Функція, яка перевіряє максимальну допустиму кількість інградієнтів на складі. Тобто, кожен інградієнт окремо.
module.exports.checkQuantityOfIngradients = function checkQuantityOfIngradients(ingradient, quantity) {

    // Дефолтне значення максимально допустимої кількості інградієнтів на складі.
    var maxQuantityOfIngradient = ingradients.ingradients

    // Перевіряємо, чи є замовлений інградієнт на складі.
    if (warehouseIngradients.warehouseIngradients.hasOwnProperty(ingradient)) {

        // Отримуємо поточне значення кількості інградієнту на складі.
        var currentQuantityOfIngradient = warehouseIngradients.warehouseIngradients[ingradient]

        // До поточної кількості інградієнту на складі додаємо кількість, яку було замовлено.
        var result = parseInt(currentQuantityOfIngradient) + parseInt(quantity)

        // Перевіряємо, чи не перевищують всі інградієнти і страви разом взяті максимальне допустиме значення матеріалів на складі.
        var result2 = operationWithTotalQuantityOfAllInWarehouse.checkTotalQuantity(exports.getTotalQuantityOfIngradients(), quantityReadyMealsInWarehouse.getTotalQuantityOfReadyMeals())
        // Якщо не перевищує, то нічого не робимо.
        if (result2 === true) {

        } else {
            // Якщо перевищує, то повідомляємо, що товар не буде добавлений на склад і завершуємо виконання функції.
            console.log("Кількість товару перевищує загальну місткість складу.")
            console.log("Товар не буде добавлено на склад.")
            // Важливо ! Ми повертаємо false, але у батьківській функції отримується 0.

            systemCommands.EXIT("Кількість товару перевищує загальну місткість складу.")
            return false
        }

        // Перевіряємо, чи перевищує сума поточної кількості інградієнту і замовленої.
        // Якщо перевищує, то виконуємо наступні операції.
        if (result >= maxQuantityOfIngradient) {

            // Від отриманого результату віднімаємо максимальну допустиму кількість.
            result = result - maxQuantityOfIngradient
            // Тепер отримуємо кількість, яку ми можемо добавити на склад.
            quantity = parseInt(quantity) - parseInt(result)


            // Показуємо, скільки зайвих інградієнтів було замовлено.
            console.log("Кількість замовлення перевищена: " + ingradient + " - " + result) // 1

            const restaurantBudget = fs.readFileSync("./budget/restaurantBudget.txt", { encoding: "UTF-8" });
            const readyMeal = JSON.parse(fs.readFileSync("./warehouse/readyMeals.txt", { encoding: "UTF-8" }));
            const warehouseIngredient = JSON.parse(fs.readFileSync("./warehouse/warehouseIngradients.txt", { encoding: "UTF-8" }));
            const warehouses = {
                ...readyMeal,
                ...warehouseIngredient
            };
            const trash = trashService.getTrash();
            const trashCopy = { ...trash}
            const auditRecord = {
                message: `Order => Wasted: ${ingradient} ${result} (limit: ${maxQuantityOfIngradient} ) `,
                warehouses,
                restaurantBudget,
                trash: trashCopy
            }
            audit.addToAudit(auditRecord);

            // Повертаємо кількість, яку можемо добавити на склад готових страв.
            return quantity
        }

        // Якщо сума інградієнтів і замовлених не перевищує ліміт, то просто повертаємо значення кількості замовлення.
        return quantity
    }
}

// Функція, яка повертає загальну суму всіх інградієнтів на складі.
module.exports.getTotalQuantityOfIngradients = function getTotalQuantityOfIngradients() {

    // Початкове значення 0.
    var quantity = 0

    // Отримуємо кількість всіх інградієнтів на складі.
    for (var i = 0; i < Object.keys(warehouseIngradients.warehouseIngradients).length; i++) {

        // Отримуємо значення кількості кожного інградієнту і додаємо це у локальну змінну кількості - quantity.
        quantity = quantity + Object.values(warehouseIngradients.warehouseIngradients)[i]
    }

    // Повертаємо суму кількостей інградієнтів.
    return parseInt(quantity)
}