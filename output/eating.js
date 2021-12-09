const fs = require("fs");
const user = require("../user/user");
const audit = require("../restaurantLogs/audit");

const pathForBudget = require('../budget/restaurantBudget.txt');

// const { checkIngradients } = require('../warehouse/operationWithWarehouse');
const trashService = require("../services/trashService");


// Функція для демонстрації трапези.
module.exports.eating = function eating() {
    // Отримуємо ім`я користувача.
    var name = user.getName()

    // Отримуємо страву, яку замовив користувач.
    var food = user.getFood()



        const restaurantBudget = fs.readFileSync("./budget/restaurantBudget.txt", { encoding: "UTF-8" });
        const readyMeals = JSON.parse(fs.readFileSync("./warehouse/readyMeals.txt", { encoding: "UTF-8" }));
        const warehouseIngradients = JSON.parse(fs.readFileSync("./warehouse/warehouseIngradients.txt", { encoding: "UTF-8" }));
        const trash = trashService.getTrash();
        const trashCopy = {...trash}
        const warehouses = {
            ...readyMeals,
            ...warehouseIngradients
        };

        // Виводимо повідомлення про трапезу.
        const auditRecord = {
            message: `${name[0]}, ${food[0]} => success`,
            restaurantBudget,
            warehouses,
            trash: trashCopy
        };
        audit.addToAudit(auditRecord);
        console.log(name + " eats " + food)

        console.log("-------------------------------------------------------------")

        // Повертаємо імя і страву користувача для тестування.
        return [user.getName(), user.getFood()]


}