const Rectangle = require('./Rectangle');

const rectangle = new Rectangle("Rectangle", 4, 4);
area = rectangle.getArea();
isSquare = rectangle.isSquare();

console.log("Area Is: " + area);
console.log("Is Square: " + isSquare);
