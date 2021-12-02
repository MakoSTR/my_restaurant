const fs = require("fs");
this.buy_command = true

this.audit_command = true

this.order_command = true
this.order_command_baseIngradients = true
this.order_command_readyMeals = true

this.table_command = true

module.exports.getBuyCommand = function getBuyCommand() {
    return this.buy_command
}

module.exports.setBuyCommand = function setBuyCommand(buy_command) {
    this.buy_command = buy_command
}

module.exports.getAuditCommand = function getAuditCommand() {
    return this.audit_command
}

module.exports.setAuditCommand = function setAuditCommand(audit_command) {
    this.audit_command = audit_command
}

module.exports.getOrderCommand = function getOrderCommand() {
    return this.order_command
}

module.exports.setOrderCommand = function setAuditCommand(order_command) {
    this.order_command = order_command
}

module.exports.getTableCommand = function getTableCommand() {
    return this.table_command
}

module.exports.setTableCommand = function setTableCommand(table_command) {
    this.table_command = table_command
}

module.exports.setOrder_command_baseIngradients = function setOrder_command_baseIngradients(order_command_baseIngradients){
    this.order_command_baseIngradients = order_command_baseIngradients
}

module.exports.getOrder_command_baseIngradients = function getOrder_command_baseIngradients(){
    return this.order_command_baseIngradients
}

module.exports.setOrder_command_readyMeals = function setOrder_command_readyMeals(order_command_readyMeals){
    this.order_command_readyMeals = order_command_readyMeals
}

module.exports.getOrder_command_readyMeals = function getOrder_command_readyMeals(){
    return this.order_command_readyMeals
}