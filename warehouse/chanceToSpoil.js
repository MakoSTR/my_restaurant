const fs = require("fs")

// За допомогою chanceToSpoil можна буде отримати шанс на псування страви.

// Отримуємо з файла chanceToSpoil.txt число, яке означає шанс зіпсування страви..
var chanceToSpoil = fs.readFileSync(__dirname + "/chanceToSpoil.txt")

// Отримане число (шанс) присвоюємо змінній chanceToSpoil.
module.exports.chanceToSpoil = chanceToSpoil = JSON.parse(chanceToSpoil);