function myParent()
{
    console.log("Hello parent");
}

myParent.prototype = {
    myMethod: () => {
        console.log("Hello parent method");
    }
}

function myFunction()
{
    myParent.call(this);
    console.log("Hello function");
}

myFunction.prototype = {
    innerMethod: () => {
        console.log("Hello some deeply nested method");
    },
    myMethod: () => {
        myParent.prototype.myMethod.call(this);
        console.log("Hello method");
        myFunction.prototype.innerMethod.call(this);
    }
}

let myInstance = new myFunction();
myInstance.myMethod();