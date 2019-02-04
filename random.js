function noidea()
{
	var noget = [ "Ты о чём ?", "В смысле ?", "М ?", "Блин, сложно" ];
	return noget[Math.floor(Math.random() * noget.length)];
}

console.log(noidea());
