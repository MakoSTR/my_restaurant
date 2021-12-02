const operationWithTotalQuantityOfAllInWarehouse = require("./operationWithTotalQuantityOfAllInWarehouse")

test("Функція, яка перевіряє максимальне значення матеріалу на складі." +
    "Якщо ліміт не перевищений і якщо якщо перевищений.", function () {

    var result = operationWithTotalQuantityOfAllInWarehouse.checkTotalQuantity(150,50)
    expect(result).toBe(true)

    var result = operationWithTotalQuantityOfAllInWarehouse.checkTotalQuantity(150,51)
    expect(result).toBe(-1)
})