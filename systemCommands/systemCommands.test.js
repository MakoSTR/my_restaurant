const systemCommands = require("./systemCommands")

test("Логіки в даній перевірці немає. Node js хоче протестувати цю функцію." +
    "Я просто мокаю вихід і отримую true, логіки немає !",function () {

    process.exit = jest.fn(process.exit).mockImplementationOnce(function () {

        console.log("Виходимо з програми.")
    })

    var result = systemCommands.EXIT("test")
    expect(result).toBe(true)
})