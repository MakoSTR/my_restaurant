const fs = require("fs");
const user = require("../user/user")

// Знижка, з якою ми працюємо.
module.exports.discountForUser = 0

// Знижка, дефолтне значення. В разі зміни, міняємо його.
var discount = 0.1

// Функція, яка встановлює кількість відвідувань користувачем. В разі, якщо відвідувань буде 3, то надаємо знижку.
module.exports.setVisit = function setVisit(name) {

    // Кількість відвідувань користувачем. По дефолту 0.
    var result = 0

    // Перевіряємо. Якщо такий користувач вже був у нас, то переходимо сюди.
    if (fs.existsSync(__dirname + `/users/${name}.txt`)) {

        // Так як користувач вже був, то зчитуємо кількість його відвідувань.
        result = exports.readFile(name)
        // Зчитали кілкьість відвідувань і додаємо до цього значення + 1.
        result = parseInt(result) + 1

        // Якщо користувач був 2 рази, цей раз буде для ного 3. Тому, переходимо сюди.
        if (result == 3) {

            // Користувач отримує знижку. Її передаємо у функцію, яка присвоює цю знижку змінній, з якою ми безпосередньо працюємо.
            exports.setDiscount(discount)
            // Після того, як ми надали користувачу знижу - обнуляємо його значення. А саме - кількість відвідувань, до 0.
            exports.writeFile(name, 0)

            // Повертаємо ім'я користувача, кількість його відвідувань і знижку, щоб перевірити значення.
            return [name, result, exports.discountForUser]

        } else {

            // Якщо в користувача це 1, або 2 відвідування, то просто перезаписуємо нове значення у його файл.
            exports.writeFile(name, result)
        }

    } else {

        // Якщо це новий користувач, якого в нас не було, то створюємо для нього файл і записуємо 0 відвідування.
        exports.writeFile(name, 0)
        // Тепер ми створили файл для користувача.
        // Перезапускаємо функцію, якій передаємо ім'я користувача, щоб поставити йому 1 відвідування.
        setVisit(name)
    }

    // Якщо це було 1, або 2 відвідування, то повертаємо ім'я користувача і кількість його відвідувань для перевірки.
    return [name, JSON.parse(exports.readFile(name))]
}

// Функція, яка присвоює знижку змінній, з якою ми беспосередньо працюємо.
module.exports.setDiscount = function setDiscount(value) {

    // Встановлюємо значення знижки у змінну, з якою беспосередньо працюємо.
    exports.discountForUser = value
}

// Функція, яка повертає значення знижки.
module.exports.getDiscount = function getDiscount() {

    // Повертаємо значення знижки.
    return exports.discountForUser
}

// Функція, яка ресетить відвідування користувача і розмр знижки.
module.exports.resetVisits = function resetVisits() {

    // Встановлюємо знижку 0 і записуємо значення відвідувань 0 у файл користувача.
    exports.setDiscount(0)
    exports.writeFile(user.getName(), 0)

    // Повертаємо значення знижки, щоб перевірити, чи його значення обнулилось.
    return exports.discountForUser
}

// Функція, яка зчитує кількість відвідувань користувачем.
module.exports.readFile = function readFile(name) {

    // Повертаємо кількість відвідувань користувачем.
    return fs.readFileSync(__dirname + `/users/${name}.txt`)
}

// Функція, яка записує ім'я користувача і кількість його відвідувань у файл.
module.exports.writeFile = function writeFile(name, value) {

    // Записуємо у файл значення, які отримуємо у параметрах.
    fs.writeFileSync(__dirname + `/users/${name}.txt`, JSON.stringify(value))
}