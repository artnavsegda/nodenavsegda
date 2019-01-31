const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
	.use(express.static(path.join(__dirname, 'public')))
	.get('/hello', (req, res) => res.send('Hello express'))
	.listen(PORT, () => console.log(`Listening on ${ PORT }`))
	
