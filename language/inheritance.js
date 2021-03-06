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
    this.myMethod = () => {
        myParent.prototype.myMethod.call(this);
        console.log("Hello overriden method");
    };
}

myFunction.prototype = {
    myMethod: () => {
        myParent.prototype.myMethod.call(this);
        console.log("Hello method");
    }
}

let myInstance = new myFunction();
myInstance.myMethod();