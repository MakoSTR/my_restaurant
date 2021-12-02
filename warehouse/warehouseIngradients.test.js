const fs = require("fs")
const warehouseIngradients = require("./warehouseIngradients")

test("Функція перевіряє кількість базових інградієнтів на складі." +
    "Якщо їх не 16, то помилка.", function () {

    var result = Object.keys(warehouseIngradients.warehouseIngradients)
    expect(result).toHaveLength(16)
})