const Rectangle = require("./Rectangle");


test ("get the area of the shape object", ()=>{
    const area = new Rectangle("Rectangle", 4, 6);
    const areaIs = area.getArea();
    expect(areaIs).toBe(16);
});
