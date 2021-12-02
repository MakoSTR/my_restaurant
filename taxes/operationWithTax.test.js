const operationWithTax = require("./operationWithTax")
const operationWithDailyTax = require("./operationWithPurchaseTax")

test("Перевіряємо функцію, яка вираховує податок з ціни. По дефолту податок 10%.", function () {

    // Мокаємо функцію запису у файл.
    operationWithDailyTax.purchaseTax = jest.fn(operationWithDailyTax.purchaseTax).mockImplementationOnce(function () {

        console.log("Записуємо податки у файл.")
    })

    var result = operationWithTax.withdrawTaxes(100)
    expect(result).toBe(parseFloat(90))
})

test("Перевіряємо функцію, яка вираховує податок з ціни і додає його до неї. По дефолту податок 10%.", function () {

    var result = operationWithTax.addTaxes(100)
    expect(parseFloat(result)).toBe(110.0)
})