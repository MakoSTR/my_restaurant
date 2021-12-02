const fs = require("fs")

var waste = fs.readFileSync(__dirname + "/waste.txt")

module.exports.waste = waste = JSON.parse(waste);