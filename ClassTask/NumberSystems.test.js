const convertingNumberBaseSystem = require("./NumberSystems.js");

test("convert number to another base and return the base",()=>{

    let number = 110;
    let base = 2;
    let newBase;
    const NumberSystems = convertingNumberBaseSystem(number, base, newBase = 3);
    expect(NumberSystems).toBe(100)
})


