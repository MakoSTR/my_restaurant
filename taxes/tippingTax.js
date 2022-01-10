const fs = require("fs");

var tippingTax = fs.readFileSync(__dirname + "/tippingTax.txt")

module.exports.tippingTax = tippingTax = JSON.parse(tippingTax)