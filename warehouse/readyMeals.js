const fs = require("fs")

// За допомогою readyMeals можна буде отримати кількість готових страв на складі.

// Отримуємо з файла readyMeals.txt масив об'єктів зі стравами.
var readyMeals = fs.readFileSync(__dirname + "/readyMeals.txt")

// Отриманий масив об'єктів присвоюємо змінній readyMeals.
module.exports.readyMeals = readyMeals = JSON.parse(readyMeals);