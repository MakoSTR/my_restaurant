// Функція, яка приймає в параметрах 4 значення. Всі інші присвоює під час виконання програми.
module.exports.User = function User(name, budget, food, allergy) {

    // Ім'я користувача.
    this.name = name

    // Бюджет користувача.
    this.budget = budget

    // Їжа, яку замовив користувач.
    this.food = food

    // Алергія, яку має користувач.
    this.allergy = allergy

    // Ціна, яку користувач має заплатити за замовлення страви.
    this.price = 0

    // Список інградієнтів, які входять у страву, яку замовив користувач.
    this.ingradients = []

    // Масив з алергіями. Якщо в користувача є алергія і вона входить у список інградієнтів страви, яку він замовив.
    this.haveAllergy = []

    // Бюджет користувача, після того, як він оплатить страву.
    this.budgetAfterPay = 0

    // Повна вартість ціни страви, яку замовив користувач, разом з націнкою.
    this.fullPayment = 0

    //
    this.readyMeals = []

    //
    this.ingradientsOfReadyMeals = []

    // Повертаємо масив з вхідними елементами функції.
    return [name, budget, food, allergy]
}

// За допомогою методів set - можна буде замінити значення на нове. (нове значення потрібно буде передати параментром)

// За допомогою методів get - можна буде отримати значення.

module.exports.getName = function getName() {
    return this.name
}

module.exports.setName = function setName(name) {
    this.name = name
}

module.exports.getBudget = function getBudget() {
    return this.budget
}

module.exports.setBudget = function setBudget(budget) {
    this.budget = budget
}

module.exports.getFood = function getFood() {
    return this.food
}

module.exports.setFood = function setFood(food) {
    this.food = food
}

module.exports.getAllergy = function getAllergy() {
    return this.allergy
}

module.exports.setAllergy = function setAllergy(allergy) {
    this.allergy = allergy
}

module.exports.setPrice = function setPrice(price) {
    this.price = price
}

module.exports.getPrice = function getPrice() {
    return this.price
}

module.exports.setIngradients = function setIngradients(ingradients) {
    this.ingradients = ingradients
}

module.exports.getIngradients = function getIngradients() {
    return this.ingradients
}

module.exports.setHaveAllergy = function setHaveAllergy(haveAllergy) {
    this.haveAllergy = haveAllergy
}

module.exports.getHaveAllergy = function getHaveAllergy() {
    return this.haveAllergy
}

module.exports.setBudgetAfterPay = function setBudgetAfterPay(budgetAfterPay) {
    this.budgetAfterPay = budgetAfterPay
}

module.exports.getBudgetAfterPay = function getBudgetAfterPay() {
    return this.budgetAfterPay
}

module.exports.setFullPayment = function setFullPayment(fullPayment) {
    this.fullPayment = fullPayment
}

module.exports.getFullPayment = function getFullPayment() {
    return this.fullPayment
}

module.exports.setReadyMeals = function setReadyMeals(readyMeals){
    this.readyMeals = readyMeals
}

module.exports.getReadyMeals = function getReadyMeals(){
    return this.readyMeals
}

module.exports.setIngradientsOfReadyMeals = function setIngradientsOfReadyMeals(ingradientsOfReadyMeals){
    this.ingradientsOfReadyMeals = ingradientsOfReadyMeals
}

module.exports.getIngradientsOfReadyMeals = function getIngradientsOfReadyMeals(){
    return this.ingradientsOfReadyMeals
}