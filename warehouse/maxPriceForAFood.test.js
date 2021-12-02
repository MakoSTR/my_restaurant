const fs = require("fs")
const maxPriceForAFood = require("./maxPriceForAFood")

test("Функція, яка перевіряє, що максимальна межа ціна для страви буде 20.", function () {

    var result = maxPriceForAFood.maxPriceForAFood
    expect(result).toBe(20)
})