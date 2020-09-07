function myParent()
{
    this.myMethod = () => {
        console.log("Hello parent method");
    }
    console.log("Hello parent");
}

function myFunction()
{
    myParent.call(this);
    this.myMethod = () => {
        console.log("Hello method");
    }
    console.log("Hello function");
}

let myInstance = new myFunction();
myInstance.myMethod();