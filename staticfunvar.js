const makeCounter = () => {
    let x = 0;
    return function()
    {
        x++;
        return x;
    }
}

const counter = makeCounter()
const counter2 = makeCounter()

console.log(counter())  // 1
console.log(counter())  // 2
console.log(counter2()) // 1
console.log(counter())  // 3
console.log(counter2()) // 2