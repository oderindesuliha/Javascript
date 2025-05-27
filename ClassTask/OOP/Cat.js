const Animal = require('./Animal');

class Dog extends Animal {
    constructor(name, color, age, breed){
        super(name, color, age);
        this.breed = breed;
    }
}