const fs = require("fs")

var result = fs.readFileSync(__dirname + "/readyMeals.txt")

module.exports.readyMeals = readyMeals = JSON.parse(result)