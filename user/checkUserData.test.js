const checkUserData = require("./checkUserData")
const processExit = require("./checkUserData");
const systemCommands = require("../systemCommands/systemCommands")

test("Перевіряємо кількість алергії, яка є у користувача в страві, яку він замовив.", function () {

    var result1 = checkUserData.allergyCheck(["Soy"], ["Water", "Milk", "Water"])
    expect(result1).toHaveLength(0)

    var result2 = checkUserData.allergyCheck(["Soy"], ["Soy", "Milk", "Water"])
    expect(result2).toHaveLength(1)

    var result3 = checkUserData.allergyCheck(["Soy", "Milk"], ["Soy", "Milk", "Water"])
    expect(result3).toHaveLength(2)

    var result4 = checkUserData.allergyCheck(["Soy", "Milk", "Water"], ["Soy", "Milk", "Water"])
    expect(result4).toHaveLength(3)
})

test("Перевіряємо, чи вхідні дані підходять під критерії для замовлення.", function () {

    // Мокаємо функцію виходу.
    systemCommands.EXIT = jest.fn(systemCommands.EXIT).mockImplementation(function () {
        console.log("EXIT")
    })

    var result1 = checkUserData.checkUser("Maksym", 1000, "Emperor Chicken", "Soy")
    expect(result1).toBe(true)

    var result2 = checkUserData.checkUser("", 1000, "Emperor Chicken", "Soy")
    expect(result2).toBe(false)

    var result3 = checkUserData.checkUser("Maksym", 0, "Emperor Chicken", "Soy")
    expect(result3).toBe(false)

    var result4 = checkUserData.checkUser("Maksym", 1000, "Emperor Chickenx", "Soy")
    expect(result4).toBe(false)

    var result5 = checkUserData.checkUser("Maksym", 1000, "Emperor Chicken", ["Soy","Soy","Soy","Soy","Soy","Soy","Soy","Soy","Soy","Soy","Soy"])
    expect(result5).toBe(false)
})