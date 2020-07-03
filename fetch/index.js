fetch('https://github.com/')
    .then(res => res.text())
    .then(body => console.log(body));
    
