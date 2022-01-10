const fs = require('fs');
const quantityOfPeople = require('./main');
const {buyNewIngradients, addReadyMeals, addIngradientsAndReadyMeals} = require('./admin/admin');
const operationWithDailyTax = require("./taxes/operationWithDailyTax");
const customersBudget = require('./resources/customersBudget.json');
const menu = require('./menu/notBaseIngradients.json');
const configuration = require('./resources/configuration.json');

const filePath = './input/input.txt';
const input = fs.readFileSync(filePath, {encoding: 'utf8'});
const inputArray = input.split('\n');
const inputArrays = inputArray.map(array => array.split(', '));
const customers = Object.keys(customersBudget);
const dishes = Object.keys(menu);
const {modifyRestaurantBudget} = require('./budget/operationWithBudget')
const logger = require("./restaurantLogs/operationWithLogs");
const restaurantBudget = require('./budget/restaurantBudget')
const auditService = require('./restaurantLogs/audit');
const audit = require("./restaurantLogs/audit");
const trashService = require('./services/trashService');
const wasteLimit = require('./resources/configuration.json');
const operationWithGarbageTax = require("./taxes/operationWithGarbageTax")

// const operationWithDailyTax = require("./taxes/operationWithDailyTax")

const poisonedMessage = () => {
    const restaurantBudget = fs.readFileSync("./budget/restaurantBudget.txt", {encoding: "UTF-8"});
    const readyMeal = JSON.parse(fs.readFileSync("./warehouse/readyMeals.txt", {encoding: "UTF-8"}));
    const warehouseIngradient = JSON.parse(fs.readFileSync("./warehouse/warehouseIngradients.txt", {encoding: "UTF-8"}));
    const warehouses = {
        ...readyMeal,
        ...warehouseIngradient
    };
    const trash = trashService.getTrash();
    const trashCopy = {...trash}

    const auditRecord = {
        message: `Restaurant Poisoned`,
        warehouses,
        restaurantBudget,
        trash: trashCopy
    }
    audit.addToAudit(auditRecord);
}

const mainSwitcher = inputArrays => {
    operationWithDailyTax.openRestaurant();

    const restaurantBudget = fs.readFileSync("./budget/restaurantBudget.txt", {encoding: "UTF-8"});
    const readyMeals = JSON.parse(fs.readFileSync("./warehouse/readyMeals.txt", {encoding: "UTF-8"}));
    const warehouseIngradients = JSON.parse(fs.readFileSync("./warehouse/warehouseIngradients.txt", {encoding: "UTF-8"}));
    const warehouses = {
        ...readyMeals,
        ...warehouseIngradients
    };
    const initialAuditRecord = {
        initialWarehouses: warehouses,
        initialBudget: restaurantBudget
    }
    audit.addToAudit(initialAuditRecord);
    const trash = trashService.getTrash();
    const poisoned = trashService.checkIsPoisoned(trash, wasteLimit['waste limit'])


    for (const input of inputArrays) {
        const action = input[0];

        switch (action) {
            case 'Buy':
                if (!trashService.getPoisoned()) {
                    const name = [input[1]];
                    const food = [input[2]];
                    if (input[1] === `Recommend`) {
                        quantityOfPeople([input[2]], [input[3]], false, 0, true)
                    } else {
                        quantityOfPeople(name, food);
                    }
                } else {
                    poisonedMessage();
                }
                console.log('Buy');
                break;
            case 'Table':
                if (!trashService.getPoisoned()) {
                    const names = input.filter(i => { // знаходимо всіх кастомерів
                        return customers.some(customer => i === customer);
                    })
                    const foods = input.filter(i => { //знаходимо всі страви
                        return dishes.some(dish => i === dish);
                    });
                    if (input[1] === "Pooled") {
                        quantityOfPeople(names, foods, true);
                    }
                    if (input[1] === `Recommend`) {
                        console.log(names)
                        console.log(input[4])

                        for (var x = 0; x < names.length; x++){
                            // console.log([names[x]], [input[x + 4]], false, 0, true)
                            quantityOfPeople([names[x]], [input[x + 4]], false, 0, true)
                        }
                        // process.exit(-1)
                        // quantityOfPeople([names[0]], [input[4]], false, 0, true)
                    }
                    // else {
                    //     quantityOfPeople(names, foods, false);
                    // }
                } else {
                    poisonedMessage();
                }
                console.log('Table');
                break;
            case 'Order':
                if (!trashService.getPoisoned()) {
                    if (configuration.order === 'ingredients') {
                        const ingredients = [input[1]];
                        const quantity = [input[2]];

                        buyNewIngradients(ingredients, quantity)
                    }
                    if (configuration.order === 'dishes') {
                        const dishes = [input[1]];
                        const quantity = [input[2]];
                        addReadyMeals(dishes, quantity)
                    }
                    if (configuration.order === 'all') {
                        const ingredients = [input[1]];
                        const quantityIng = [input[2]];
                        const dishes = [input[3]];
                        const quantityDish = [input[4]];
                        const array = [[...ingredients], ...quantityIng, [...dishes], quantityDish];

                        addIngradientsAndReadyMeals(array)
                    }
                } else {
                    poisonedMessage();
                }

                console.log('Order');
                break;
            case 'Budget':
                console.log('Budget');
                const sign = input[1];
                const amount = parseInt(input[2]);
                modifyRestaurantBudget(sign, amount)

                const changedRestaurantBudget = fs.readFileSync("./budget/restaurantBudget.txt", {encoding: "UTF-8"});
                const readyMeal = JSON.parse(fs.readFileSync("./warehouse/readyMeals.txt", {encoding: "UTF-8"}));
                const warehouseIngradient = JSON.parse(fs.readFileSync("./warehouse/warehouseIngradients.txt", {encoding: "UTF-8"}));
                const warehouse = {
                    ...readyMeal,
                    ...warehouseIngradient
                };
                const trash = trashService.getTrash();
                const trashCopy = {...trash}

                const auditRecord = {
                    message: `Action ${input[0]} ${sign} ${amount} => Restaurant Budget: ${changedRestaurantBudget}`,
                    warehouses: warehouse,
                    restaurantBudget: changedRestaurantBudget,
                    trash: trashCopy
                }
                audit.addToAudit(auditRecord);
                break;
            case 'Audit':
                operationWithDailyTax.closeRestaurant();
                auditService.writeAudit();
                break;
            case 'Throw trash away' :
                const wastePool = trashService.addToWastePool();

                fs.writeFileSync('./resources/output/wastePool.json', JSON.stringify(wastePool));

                trashService.cleaner();

                //
                const restaurantBud = fs.readFileSync("./budget/restaurantBudget.txt", {encoding: "UTF-8"});
                const dish = JSON.parse(fs.readFileSync("./warehouse/readyMeals.txt", {encoding: "UTF-8"}));
                const ingredient = JSON.parse(fs.readFileSync("./warehouse/warehouseIngradients.txt", {encoding: "UTF-8"}));
                const dishAndIngredient = {
                    ...dish,
                    ...ingredient
                };
                const newTrashObj = trashService.getTrash();
                const newTrashObjCopy = {...newTrashObj}

                const auditMessage = {
                    message: `Action ${input[0]} => ${input[0]}`,
                    warehouses: dishAndIngredient,
                    restaurantBudget: restaurantBud,
                    trash: newTrashObjCopy
                }
                audit.addToAudit(auditMessage);

                console.log('Throw trash away');
                break;
            default:
                const trashh = trashService.getTrash();
                const readyMeals = JSON.parse(fs.readFileSync("./warehouse/readyMeals.txt", {encoding: "UTF-8"}));
                const warehouseIngradients = JSON.parse(fs.readFileSync("./warehouse/warehouseIngradients.txt", {encoding: "UTF-8"}));
                const restaurantBudget = fs.readFileSync("./budget/restaurantBudget.txt", {encoding: "UTF-8"});
                const trashhCopy = {...trashh}
                const warehouses = {
                    ...readyMeals,
                    ...warehouseIngradients
                };
                const defaultAuditRecord = {
                    message: `Action ${input[0]} => command disabled`,
                    warehouses: warehouses,
                    restaurantBudget,
                    trash: trashhCopy
                }
                audit.addToAudit(defaultAuditRecord);
                console.log('command disabled');
        }

        // operationWithDailyTax.closeRestaurant()
    }
}

mainSwitcher(inputArrays);