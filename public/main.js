var xhttp = new XMLHttpRequest();

console.log("hello javascript");

function ajax(callback)
{
	xhttp.onreadystatechange = callback;
	xhttp.open("GET", "hello", true);
	xhttp.send();
}

function dropdata()
{
        document.forms["demo"].elements["redirect_uri"].value = location.href;
}

function startindex()
{
	ajax(function() {
	    if (this.readyState == 4 && this.status == 200) {
	       JSON.parse(xhttp.responseText).forEach( (element) => {
					 var node = document.createElement("LI");
					 var textnode = document.createTextNode(element.name);
					 node.appendChild(textnode);
					 document.getElementById("mylist").appendChild(node);
					 //innerHTML += element.name;
	       })
	    }
	});
}

function appendclear()
{
	ajax(function() {
	    if (this.readyState == 4 && this.status == 200) {
	       JSON.parse(xhttp.responseText).forEach( (element) => {
					 var node = document.createElement("OPTION");
					 node.value = element.name;
					 document.getElementById("browsers").appendChild(node);
					 //innerHTML += element.name;
	       })
	    }
	});
}
