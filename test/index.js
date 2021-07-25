const assert = require("assert");
const CoffeeMachine = require("../src/coffee-machine");

const coffeeMachine = new CoffeeMachine(4);

describe("The coffee machine - " , () => {
    describe("Refill function - ", () => {
        it("should be able to fill the ingrediants in the coffee machine - ", () => {
            let inputIngrediants = {
                "hot_water": 500,
                "hot_milk": 500,
                "ginger_syrup": 100,
                "sugar_syrup": 100,
                "tea_leaves_syrup": 100
            }
            coffeeMachine.refillIngrediants(inputIngrediants);
            assert.strictEqual(JSON.stringify(coffeeMachine.ingrediants), JSON.stringify(inputIngrediants));
        });
        it("should be able to refill the ingrediants in the coffee machine - ", () => {
            let inputIngrediants = {
                "hot_water": 50,
                "hot_milk": 50,
                "ginger_syrup": 10,
                "sugar_syrup": 10,
                "tea_leaves_syrup": 10
            }
            coffeeMachine.refillIngrediants(inputIngrediants);
            assert.strictEqual(JSON.stringify(coffeeMachine.ingrediants), JSON.stringify({
                "hot_water": 550,
                "hot_milk": 550,
                "ginger_syrup": 110,
                "sugar_syrup": 110,
                "tea_leaves_syrup": 110
            }));
        });
    });
    describe("Serve beverages function - ", () => {
        it("should be able to serve beverages", async () => {
            let requestedBeverages = {
                "hot_tea": {
                    "hot_water": 300,
                    "hot_milk": 150,
                    "ginger_syrup": 10,
                    "sugar_syrup": 10,
                    "tea_leaves_syrup": 30
                },
                "hot_coffee": {
                    "hot_water": 100,
                    "ginger_syrup": 30,
                    "hot_milk": 400,
                    "sugar_syrup": 50,
                    "tea_leaves_syrup": 30
                }
            };
            let result = await coffeeMachine.serveBeverages(requestedBeverages);
            assert.strictEqual(result.success, true);
            assert.strictEqual(result.body.length, 2);
            assert.strictEqual(result.body[0].success, true);
            assert.strictEqual(result.body[0].message, "hot_tea is prepared");
            assert.strictEqual(result.body[1].success, true);
            assert.strictEqual(result.body[1].message, "hot_coffee is prepared");
        });
        it("should return error message if ingredients are not suffient", async () => {
            let requestedBeverages = {
                "hot_tea": {
                    "hot_water": 600,
                    "hot_milk": 100,
                    "ginger_syrup": 10,
                    "sugar_syrup": 10,
                    "tea_leaves_syrup": 30
                }
            };
            let result = await coffeeMachine.serveBeverages(requestedBeverages);
            assert.strictEqual(result.success, true);
            assert.strictEqual(result.body.length, 1);
            assert.strictEqual(result.body[0].success, false);
            assert.strictEqual(result.body[0].message, "hot_tea cannot be prepared because item hot_water is not sufficient");
        });
        it("should return error for requesting beverages more than the outlets", async () => {
            let requestedBeverages = {
                "hot_tea": {
                    "hot_water": 600,
                    "hot_milk": 100,
                    "ginger_syrup": 10,
                    "sugar_syrup": 10,
                    "tea_leaves_syrup": 30
                },
                "hot_coffee": {
                    "hot_water": 100,
                    "ginger_syrup": 30,
                    "hot_milk": 400,
                    "sugar_syrup": 50,
                    "tea_leaves_syrup": 30
                },
                "black_tea": {
                    "hot_water": 300,
                    "ginger_syrup": 30,
                    "sugar_syrup": 50,
                    "tea_leaves_syrup": 30
                },
                "green_tea": {
                    "hot_water": 100,
                    "ginger_syrup": 30,
                    "sugar_syrup": 50,
                    "green_mixture": 30
                },
                "black_coffee": {
                    "hot_water": 100,
                    "ginger_syrup": 30,
                    "sugar_syrup": 50,
                    "green_mixture": 30
                }
            };
            let result = await coffeeMachine.serveBeverages(requestedBeverages);
            assert.strictEqual(result.success, false);
            assert.strictEqual(result.message, "Sorry, we can only serve 4 beverages at a time.");
        });
    });
    describe("Check ingrediants function", () => {
        it("should send indicator for low ingrediants", () => {
            let lowQuantityIngrediants = coffeeMachine.checkIngrediants().body;
            assert.strictEqual(lowQuantityIngrediants.length, 1);
            assert.strictEqual(JSON.stringify(lowQuantityIngrediants), "[\"hot_milk\"]");
        });
    });
});