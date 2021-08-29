const express = require('express')
var bodyParser = require('body-parser')

const app = express()

// parse application/json
app.use(bodyParser.json())

const port = 3000

class todoItem {
	constructor(description, deadline, attachment) {
		this.description = description
		this.deadline = deadline
		this.attachment = attachment
	}
}

var DB = {}

app.get('/items', (req, res) => {

})

app.get('/items/:id', (req, res) => {

})

app.post('/add/item', (req, res) => {
	console.log(req.body)
	// Required fields verification
	const description = req.body.description
	const deadline = req.body.deadline
	const attachment = req.body.attachment

	if (!description || !deadline || !attachment) {
		res.status(400).send("Description, Deadline, and Attachment fields are required.")
	}

	// Add to db, using local storage for simplicity
	var itemKey = Object.keys(DB).length // use length as key
	var itemObj = new todoItem(description, deadline, attachment)
	DB[itemKey] = itemObj
	// Since using local storage, always send success
	res.status(200).send({[itemKey]: itemObj})
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
