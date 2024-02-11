const EventEmitter = require("events");

class EvenMananger extends EventEmitter {};

const eventManager = new EvenMananger();

module.exports = eventManager;