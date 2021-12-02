const fs = require("fs")

// Отримуємо з файла restaurantBudget.txt (-> budget/restaurantBudget.txt) число, яке є бюджетом ресторану.
var budget = fs.readFileSync(__dirname + "/restaurantBudget.txt")

// Отримане число присвоюємо змінній budget.
module.exports.budget = budget = JSON.parse(budget)