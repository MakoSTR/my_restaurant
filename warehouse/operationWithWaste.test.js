const operationWithWaste = require("./operationWithWaste")

test("Перевіряємо функцію, яка додає нове значення у смітник.", function () {

    operationWithWaste.writeFile_addToWaste = jest.fn(operationWithWaste.writeFile_addToWaste).mockImplementationOnce(function () {

        console.log("Записуємо у файл.")
    })

    var result = operationWithWaste.addToWaste("Chicken2")
    expect(result).toBe("Chicken2")
})