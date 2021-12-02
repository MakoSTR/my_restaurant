const operationWithLogs = require("./operationWithLogs")
const warehouseIngradients = require("../warehouse/warehouseIngradients")
const logsFile = require("./logs")
const fs = require("fs")

test("Функція, яка перевіряє додавання інформації в логи." +
    "В результаті  маємо отримати інформацію, яку отримуємо на початку програми." +
    "Також має зменшитись інградієнт.", function () {

    var quantity = 1000
    // warehouseIngradients.warehouseIngradients["Chicken"] = quantity
    warehouseIngradients.warehouseIngradients["Chicken"] = quantity - 1

    operationWithLogs.logs.length = 0
    var result = operationWithLogs.addLogs([["Maksym"], {"Chicken": warehouseIngradients.warehouseIngradients["Chicken"]}, "1500"])
    expect(result[0][0][0]).toContain(["Maksym"].toString())
    expect(result[0][1]["Chicken"]).toBe(999)
    expect(result[0][2]).toContain("1500")
    operationWithLogs.logs.length = 0
})

test("Функція, яка перевіряє процес запису логів у файл і очищення локальної змінної з логами.", function () {

    operationWithLogs.writeFile_writeLogs = jest.fn(operationWithLogs.writeFile_writeLogs).mockImplementationOnce(function () {

        console.log("Записуємо у файл.")
    })

    operationWithLogs.logs.length = 0
    operationWithLogs.logs.push(["Maksym"])
    var result = operationWithLogs.writeLogs()
    expect(result).toBe(0)
    operationWithLogs.logs.length = 0
})

test("Функція, яка перевіряє демострацію логів для користувача.", function () {

    operationWithLogs.readFile_showLogs = jest.fn(operationWithLogs.readFile_showLogs).mockImplementationOnce(function () {

        console.log("Зчитуємо файл.")
        return "Maksym"
    })

    var result = operationWithLogs.showLogs()
    expect(result).toBe("Maksym")
})

// test("test operationWithBudget.js | getLogs() function", function () {
//
//     logsFile.logsFile = ["logs"]
//     var result = operationWithLogs.getLogs()
//     expect(result).toContain("logs")
// })