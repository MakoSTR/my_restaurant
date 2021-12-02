const fs = require("fs")

var result = fs.readFileSync(__dirname + "/totalQuantity.txt")

module.exports.totalQuantity = totalQuantity = JSON.parse(result)