function myFunction()
{
    this.myMethod = () => {
        console.log("Hello method");
    }
    console.log("Hello function");
}

let myInstance = new myFunction();
myInstance.myMethod();