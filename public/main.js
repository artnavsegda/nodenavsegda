var xhttp = new XMLHttpRequest();

console.log("hello javascript");

function dropdata()
{
        document.forms["demo"].elements["redirect_uri"].value = location.href;
}

function startindex()
{
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       JSON.parse(xhttp.responseText).forEach( (element) => {
					 var node = document.createElement("LI");
					 var textnode = document.createTextNode(element.name);
					 node.appendChild(textnode);
					 document.getElementById("mylist").appendChild(node);
					 //innerHTML += element.name;
	       })
	    }
	};
	xhttp.open("GET", "hello", true);
	xhttp.send();
}
