const fs = require("fs")

var result = fs.readFileSync(__dirname + "/ingradients.txt")

module.exports.ingradients = ingradients = JSON.parse(result)