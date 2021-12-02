const operationWithVisits = require("./operationWithVisits")
const fs = require("fs");
const user = require("../user/user")

test("Функція, яка перевіряє відвідування користувача. На вхідні дані передаємо нове ім'я." +
    "В результаті отримуємо його ім'я і значення відвідувань - 1.", function () {

    var result = operationWithVisits.setVisit("TestName1")
    expect(result[0]).toBe("TestName1")
    expect(result[1]).toBe(1)
    fs.unlinkSync(__dirname + "/users/TestName1.txt")
})

test("Функція, яка перевіряє, чи отримав користувач знижку під час 3го відвідування." +
    "На вхідні дані передаємо його ім'я, 2ге відвідування, яке стане 3ім." +
    "В результаті його відвідування 3 = 2 + 1, тому він отримує знижку.", function () {

    fs.writeFileSync(__dirname + "/users/TestName2.txt", JSON.stringify(2))
    var result2 = operationWithVisits.setVisit("TestName2")
    expect(result2[0]).toBe("TestName2")
    expect(result2[1]).toBe(3)
    expect(result2[2]).toBe(0.1)
    fs.unlinkSync(__dirname + "/users/TestName2.txt")
})

test("Функція, яка обнуляє кількість відвідувань користувача і ставить значення знижки 0.", function () {

    user.setName("TestName3")
    var result = operationWithVisits.resetVisits()
    expect(result).toBe(0)
    fs.unlinkSync(__dirname + "/users/TestName3.txt")
})