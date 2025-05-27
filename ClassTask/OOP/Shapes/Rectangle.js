const Shapes = require("./Shapes");

class Rectangle extends Shapes{
    constructor(name, side1, side2){
        super(name)
        this.side1 = side1;
        this.side2 = side2;
    }

    getArea(){
        return this.side1 * this.side2;
    }

    isSquare(){
        return this.side1 === this.side2;
    }
}

module.exports = Rectangle;