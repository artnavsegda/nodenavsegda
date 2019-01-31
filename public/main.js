var xhttp = new XMLHttpRequest();

console.log("hello javascript");

function dropdata()
{
        document.forms["demo"].elements["redirect_uri"].value = location.href;
}

function startindex()
{
	document.getElementById("demo").innerHTML = "hello demo";
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       document.getElementById("demo").innerHTML = xhttp.responseText;
	    }
	};
	xhttp.open("GET", "hello", true);
	xhttp.send();
}
