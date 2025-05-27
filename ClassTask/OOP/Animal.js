class Animal {
    #name;
    #color;
    #age;

    constructor(name,color,age){
        this.name = name;
        this.color = color;
        this.age = age;

    }
    setName(name){
        this.name = name;
    }

    getName(){
        return this.name;
    }
}


module.exports = Animal