const fs = require("fs")

// За допомогою maxPriceForAFood можна буде отримати ціну, до якої ми викидаємо страву і після я кої ми додаємо її на склад готових страв..

// Отримуємо з файла maxPriceForAFood.txt мінімальну ціну для додавання страви на склад.
var maxPriceForAFood = fs.readFileSync(__dirname + "/maxPriceForAFood.txt")

// Отриману ціну присвоюємо змінній maxPriceForAFood.
module.exports.maxPriceForAFood = maxPriceForAFood = JSON.parse(maxPriceForAFood);