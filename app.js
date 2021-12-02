const quantityOfPeople = require('./main');
const fs = require('fs');
const operationWithDailyTax = require("./taxes/operationWithDailyTax");
const filePath = './input/input.txt';

const input = fs.readFileSync(filePath, {encoding:'utf8'});
const inputArray = input.split('\r\n');
const inputArrays = inputArray.map(array => array.split(', '));

const mainSwitcher = inputArrays => {
    operationWithDailyTax.openRestaurant();

    for (const input of inputArrays) {
        const action = input[0];

        switch (action) {
            case 'Buy':
                const name = [input[1]];
                const food = [input[2]];
                quantityOfPeople(name, food);
                console.log('Buy');
                break;
            case 'Table':
                console.log('Table');
                break;
            case 'Order':
                console.log('Order');
                break;
            default:
                console.log('command disabled');
        }
    }

    operationWithDailyTax.closeRestaurant();
}

mainSwitcher(inputArrays);