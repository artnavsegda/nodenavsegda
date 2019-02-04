var xhttp = new XMLHttpRequest();

console.log("hello javascript");

function ajax(address, callback)
{
	xhttp.onreadystatechange = callback;
	xhttp.open("GET", address, true);
	xhttp.send();
}

function dropdata()
{
        document.forms["demo"].elements["redirect_uri"].value = location.href;
}

function appendclear()
{
	ajax("hello", function() {
	    if (this.readyState == 4 && this.status == 200) {
	       JSON.parse(xhttp.responseText).forEach( (element) => {
					 var node = document.createElement("OPTION");
					 var textnode = document.createTextNode(element.accesstoken);
					 node.value = element.accesstoken;
					 node.appendChild(textnode);
					 document.getElementsByName("browser")[0].appendChild(node);
					 //innerHTML += element.name;
	       })
	    }
	});
}

function heartbeat()
{
	ajax("getheartbeat", function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("heartbeat").innerHTML = xhttp.responseText;
			console.log(xhttp.responseText);
		}
	})
}

function onload()
{
	setInterval(heartbeat, 5000);
	heartbeat();
	appendclear();
}
