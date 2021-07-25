class CoffeeMachine {
    constructor(outlets) {
        this.outlets = outlets;
        this.ingrediants = {};
    }
    /**
      * Function that serves requested beverages .
      * @param {beverages} array
      * @return {object}
    */
    async serveBeverages(beverages) {
        try {
            if (Object.keys(beverages).length > this.outlets) {
                return {
                    success: false,
                    message: `Sorry, we can only serve ${this.outlets} beverages at a time.`
                }
            }
            let creatingBeverages = [];
            for (let beverage in beverages) {
                //Pushing async functions. 
                creatingBeverages.push(this.prepareBeverage(beverage, beverages[beverage]));
            }
            //For preparing beverages parallelly.
            let result = await Promise.all(creatingBeverages);
            return {
                success: true,
                body: result
            }
        } catch (e) {
            return {
                success: false,
                message: e.message
            }
        }
    }
    /**
      * Function that prepare requested beverage.
      * @param {beverageName} string
      * @param {recipe} object
      * @return {object}
    */
    async prepareBeverage(beverageName, recipe) {
        try {
            /*
            In order to check all the ingrediants quantity and using it in a preparation in a
            single loop without changing the actual ingrediants. We are creating the copy of
            the ingrediants.
            */
            let tempIngrediants = { ...this.ingrediants };
            for (let ingrediant in recipe) {
                if (this.ingrediants[ingrediant] < recipe[ingrediant]) {
                    return {
                        success: false,
                        message: `${beverageName} cannot be prepared because item ${ingrediant} is not sufficient`
                    }
                } else {
                    tempIngrediants[ingrediant] -= recipe[ingrediant];
                }
            }
            //Updating ingrediants quantity after the beverage preparation.
            this.ingrediants = tempIngrediants;
            return {
                success: true,
                message: `${beverageName} is prepared`
            }
        } catch (e) {
            throw new Error(e);
        }
    }
    /**
      * Function that refill ingrediants in the coffee machine.
      * @param {refillIngrediants} object
      * @return {object}
    */
    refillIngrediants(refillIngrediants) {
        try {
            for (let ingrediant in refillIngrediants) {
                if (this.ingrediants[ingrediant]) {
                    //Ingrediant already exists, we have to add it.
                    this.ingrediants[ingrediant] += refillIngrediants[ingrediant];
                } else {
                    this.ingrediants[ingrediant] = refillIngrediants[ingrediant];
                }
            }
            return {
                success: true,
                message: "Refill operation successfull."
            }
        } catch (e) {
            return {
                success: false,
                message: e.message
            }
        }
    }
    /** 
      * Function that checks ingrediants quantity.
      * @return {object}
    */
    checkIngrediants() {
        try {
            let ingrediants = this.ingrediants;
            let lowQuantityIngrediants = [];
            for (let ingrediant in ingrediants) {
                /*
                Taking assumption - We will show the indicator for low ingrediant when its
                quantity get less than equal to 5.
                */ 
                if (ingrediants[ingrediant] <= 5) {
                    lowQuantityIngrediants.push(ingrediant);
                }
            }
            return {
                success: true,
                body: lowQuantityIngrediants
            }
        } catch (e) {
            return {
                success: false,
                message: e.message
            }
        }
    }
}

module.exports = CoffeeMachine;