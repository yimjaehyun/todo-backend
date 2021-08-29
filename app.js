const express = require('express')
const upload = require('express-fileupload')
var bodyParser = require('body-parser')

const app = express()

// parse application/json
app.use(bodyParser.json())
app.use(upload())

const port = 3000

class todoItem {
	constructor(description, deadline, attachment) {
		this.description = description
		this.deadline = deadline
		this.attachment = attachment
		this.isComplete = false
	}
}

function isIsoDate(str) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  var d = new Date(str); 
  return d.toISOString()===str;
}

var DB = {}

// Get all items in our TODO
app.get('/items', (req, res) => {
	res.send(DB)
})

// Add new TODO item
app.post('/add/item', (req, res) => {
	// Required fields verification
	const description = req.body.description
	var deadline = req.body.deadline
	const file = req.files.file

	if (!description || !deadline) {
		res.status(400).send("Description and Deadline fields are required.")
	}

	// Add attachment to DB, using local storage for simplicity
	file.mv('./attachments/'+file.name, function(err) {
		if (err) {
			res.status(400).send(err)
		} else {
			console.log("File uploaded successfully")
		}
	})

	// Verify Date is in correct format and parse it
	if (!isIsoDate(deadline)) {
		res.status(400).send("Please use valid UTC Date format: YYYY-MM-DDTHH:MN:SS.MSSZ")
	}

	deadline = new Date(deadline)

	// Add to db, using local storage for simplicity
	var itemKey = Object.keys(DB).length // use length as key
	var itemObj = new todoItem(description, deadline, file)
	DB[itemKey] = itemObj
	// Since using local storage, always send success
	res.status(200).send({[itemKey]: itemObj})
})

// Make todo item as complete
app.post('/complete/item/:itemId', (req, res) => {
	// Required fields verification
	const itemId = req.params.itemId
	const isComplete = req.body.isComplete

	if (!itemId || !isComplete) {
		res.status(400).send("itemId and isComplete fields are required.")
	}

	DB[itemId].isComplete = isComplete
	res.status(200).send({[itemId] : DB[itemId]})
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
