const notBaseIngradients = require("../menu/notBaseIngradients")
const systemCommands = require("../systemCommands/systemCommands")

// Функція, яка перевіряє, чи є алергія користувача серед інградієнтів страви, яку він замовив.
module.exports.allergyCheck = function allergyCheck(allergy, ingradients) {

    // Створюємо локальний масив. Якщо буде співпадіння алергії і інградієнтів, то вони будуть записані саме в цей масив.
    var allergyArray = []

    // Перевіряємо інградієнти.
    for (var i = 0; i < ingradients.length; i++) {

        // Перевіряємо алергії.
        for (var j = 0; j < allergy.length; j++) {

            // Якщо є співпадіння, то записуємо у масив allergyArray.
            if (ingradients[i] == allergy[j]) {

                // Процес запису алергій у масив.
                allergyArray.push(allergy[j])
            }
        }
    }

    // Повернення масиву з алергіями. Пустий, якщо не було співпадінь.
    return allergyArray
}

// Функція, яка викликається на старті програми, щоб перевірити коректність вхідних даних.
module.exports.checkUser = function checkUser(name, budget, food, allergy) {

    // Якщо ім`я користувача - пусте, або довжина його більше 20ти символів, то зупиняємо виконання програми.
    if (name == "" || name.length > 20) {
        console.log("EXIT: checkUserData.js")
        systemCommands.EXIT("Імені користувача немає, або його довжина більше 20ти символів.")
        return false
    }

    // Якщо бюджет подається у вигляді рядка, а не числа, або він менше 0, чи більше 1000000, то зупиняємо виконання програми.
    if (typeof budget == 'string' || budget <= 0 || budget > 1000000) {
        console.log("EXIT: checkUserData.js")
        systemCommands.EXIT("Якщо бюджет менший за 0, або быльший за 1000000. Або, якщо бюджет у вигляды рядка.")
        return false
    }

    // Якщо страви, яку замовив користувач, немає у нашому меню, то зупиняємо виконання програми.
    if (!notBaseIngradients.notBaseIngradients.hasOwnProperty(food)) {
        console.log("EXIT: checkUserData.js")
        systemCommands.EXIT("Якщо страви, яку замовив користувач, немає у меню.")
        return false
    }


    // Якщо у користувача більше 10ти алергій, то зупиняємо виконання програми.
    if (allergy.length > 10) {
        console.log("EXIT: checkUserData.js")
        systemCommands.EXIT("Якщо у користувача більше 10ти алергій.")
        return false
    }

    // У випадку, якщо все проходить перевірку, то повертаємо true.
    return true
}