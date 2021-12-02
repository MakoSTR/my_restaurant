const logs = require("./logs")

test("Функція, яка перевіряє, що отримані дані з файла 'logs.txt' будуть типу 'String'." +
    "Це важливо ! У всіх інших текстових файла отримується інформаціє типу 'JSON'.",function () {

    logs.logsFile = "[logs]"
    expect(typeof logs.logsFile).toBe('string')
})