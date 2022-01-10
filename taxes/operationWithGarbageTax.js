const fs = require("fs")
const penaltyForGarbage = require("./penaltyForGarbage")
const baseIngradients = require("../menu/baseIngradients")
const operationWithLogs = require("../restaurantLogs/operationWithLogs")
const waste = require("../warehouse/waste")
const operationWithWaste = require("../warehouse/operationWithWaste")
const restaurantBudget = require("../budget/restaurantBudget")
const operationWithBudget = require("../budget/operationWithBudget")
const tax = 0.15

module.exports.getGarbageTax = function getGarbageTax(ingredients) {

    var spoiledIngradients = 0

    for (var j = 0; j < Object.keys(waste.waste).length; j++) {

        spoiledIngradients += Object.values(waste.waste)[j]
    }

    var quantityOfPenaltyForGarbage = 0
    console.log("spoiledIngradients: " + spoiledIngradients)

    if (spoiledIngradients > 0) {
        quantityOfPenaltyForGarbage = 0
        if (spoiledIngradients > 100) {
            quantityOfPenaltyForGarbage = 1 * penaltyForGarbage.penaltyForGarbage
            if (spoiledIngradients > 200) {
                quantityOfPenaltyForGarbage = 2 * penaltyForGarbage.penaltyForGarbage
            }
        }
    }

    for (var i = 0; i < Object.keys(ingredients).length; i++) {

        var name = Object.keys(ingredients)[i]
        var quantity = Object.values(ingredients)[i]

        var price = baseIngradients.baseIngradients[name] * quantity
        if (quantityOfPenaltyForGarbage === 0) {
            var value = price * tax
        } else {
            var value = price * tax + quantityOfPenaltyForGarbage
        }
        operationWithLogs.addLogs("Податок на сміття: " + value)
        operationWithLogs.addLogs("Сума штрафу: " + quantityOfPenaltyForGarbage)
        operationWithLogs.writeLogs()
        quantityOfPenaltyForGarbage = 0

        operationWithBudget.removeFromBudget(restaurantBudget.budget - value)
        restaurantBudget.budget -= value
    }

    for (var k = 0; k < Object.keys(waste.waste).length; k++) {

        if (waste.waste[Object.keys(waste.waste)[k]] > 0) {

            operationWithLogs.addLogs("У смітнику було: " + Object.keys(waste.waste)[k] + " у кількості " + waste.waste[Object.keys(waste.waste)[k]])
            operationWithLogs.writeLogs()
        }

        waste.waste[Object.keys(waste.waste)[k]] = 0
    }

    operationWithWaste.writeFile_clearWaste()
}