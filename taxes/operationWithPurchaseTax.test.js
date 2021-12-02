const operationWithPurchaseTax = require("./operationWithPurchaseTax")
const purchaseTax = require("./purchaseTax")

test("Функція, яка перевіряє, чи було значення, яке отримане в параметрі, записане у файл з податками.", function () {

    // Мокаємо функцію запису.
    operationWithPurchaseTax.writeFile_purchaseTax = jest.fn().mockImplementation(function () {

        console.log("Записуємо у файл.")
    })

    purchaseTax.purchaseTax = 0
    var result = operationWithPurchaseTax.purchaseTax(10)
    expect(result).toBe(10)
})

test("Функція, яка ресетить значення податків. Тобто, обнуляє значення файлу з податками.", function () {

    // Мокаємо функцію запису.
    operationWithPurchaseTax.writeFile_resetPurchaseTax = jest.fn(operationWithPurchaseTax.writeFile_resetPurchaseTax).mockImplementationOnce(function () {

        console.log("Записуємо у файл.")
    })

    var result = operationWithPurchaseTax.resetPurchaseTax()
    expect(result).toBe(0)
})

test("Функція, яка перевіряє зчитування податків з файла.", function () {

    operationWithPurchaseTax.readFile_getTaxes = jest.fn(operationWithPurchaseTax.readFile_getTaxes).mockImplementationOnce(function () {

        return 15
    })

    purchaseTax.purchaseTax = 15

    var result = operationWithPurchaseTax.getTaxes()
    // Раніше було без "".
    expect(result).toBe("15.0")
})