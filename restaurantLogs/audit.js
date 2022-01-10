const fs = require('fs');
const auditFilePath = './restaurantLogs/audit.txt';
const endRestaurantBudget = fs.readFileSync("./budget/restaurantBudget.txt", { encoding: "UTF-8" });


class Audit {
    constructor() {
        this.auditData = [];
    }

    init = () => {
        const message =
            `INIT
            Warehouses: ${JSON.stringify(this.auditData[0].initialWarehouses)}
            Restaurant Budget: ${this.auditData[0].initialBudget}
            START
            `
        ;
        fs.appendFileSync(auditFilePath, message)
    }
    // Було в ініт вище.
    // Daily Tax: 0
    // Trash: {}

    end = (endRestaurantBudget) => {
        // const dailyTaxSum = taxService.dailyTaxSum(tax, endRestaurantBudget, startRestaurantBudget);
        let dailyTax = this.auditData[this.auditData.length-1]['DAILY TAX']  > 0 ? this.auditData[this.auditData.length-1]['DAILY TAX'] : 0;

        const message = ""
            // `\n\r DAILY TAX: ${dailyTax}\r
        // `RESTAURANT BUDGET: ${endRestaurantBudget}
        // `AUDIT END`;
        fs.appendFileSync(auditFilePath, message)
    };

    writeAudit = (tax) => {
        this.init();
        this.auditData.splice(0, 1);

        this.auditData.forEach(audit => {
            const budgetRes = audit.restaurantBudget > 0 ? audit.restaurantBudget : 'RESTAURANT BANKRUPT';

            if (audit.message) {
                const message =
                    `\r\n command: => ${audit.message}
            Warehouse: ${JSON.stringify(audit.warehouses)}`
            // Restaurant Budget: ${budgetRes}`
            // Restaurant Budget after `
            // Trash: ${JSON.stringify(audit.trash)}`

            fs.appendFileSync(auditFilePath, message)
            }
        })
        const endRestaurantBudget = this.auditData[this.auditData.length-2];
        this.end(endRestaurantBudget);
    }

    addToAudit = (audit) => {
        this.auditData.push(audit);
    }
}

const audit = new Audit();

module.exports = audit;
