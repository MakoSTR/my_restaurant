const fs = require("fs");

var purchaseTax = fs.readFileSync(__dirname + "/purchaseTax.txt")

module.exports.purchaseTax = purchaseTax = JSON.parse(purchaseTax)