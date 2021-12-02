const fs = require("fs")

if (fs.existsSync(__dirname + "/percent.txt")) {
    var tax = fs.readFileSync(__dirname +"/tax.txt")
}else{
    var tax = 0.1
}

module.exports.tax = tax = JSON.parse(tax)