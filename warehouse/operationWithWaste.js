const fs = require("fs")
const waste = require("./waste")
const baseIngradients = require("../menu/baseIngradients");

module.exports.addToWaste = function addToWaste(value) {

    waste.waste[value[0]] += value[1]

    exports.writeFile_addToWaste()

    return value
}

module.exports.writeFile_addToWaste = function writeFile_addToWaste() {

    fs.writeFileSync(__dirname + "/waste.txt", JSON.stringify(waste.waste))
}

module.exports.clearWaste = function clearWaste() {

    for (var i = 0; i < Object.keys(waste.waste).length; i++) {

        waste.waste[Object.keys(waste.waste)[i]] = 0
    }

    exports.writeFile_clearWaste()
}

module.exports.writeFile_clearWaste = function writeFile_clearWaste() {

    fs.writeFileSync(__dirname + "/waste.txt", JSON.stringify(waste.waste))
}