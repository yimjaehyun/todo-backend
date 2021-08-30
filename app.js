const express = require('express')
const upload = require('express-fileupload')
var bodyParser = require('body-parser')

const app = express()


// Debugging on localhost
const cors = require("cors")
app.use(cors())

// parse application/json
app.use(bodyParser.json())
app.use(upload())

const port = 8000

class todoItem {
	constructor(id, description, deadline, attachment) {
		this.id = id
		this.description = description
		this.deadline = deadline
		this.attachment = attachment
		this.isComplete = false
		this.isPassed = CompareDeadline(deadline)
	}
}

function isIsoDate(str) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  var d = new Date(str); 
  return d.toISOString()===str;
}

function CompareDeadline(date) {
	if (date.setHours(0, 0, 0, 0) <= (new Date()).setHours(0, 0, 0, 0)) {
		return true;
	}
	return false;
}

var DB = {}

// Get all items in our TODO
app.get('/items', (req, res) => {
	res.send(Object.values(DB))
})

// Add new TODO item
app.post('/add/item', (req, res) => {
	// Required fields verification
	const id = req.body.id
	const description = req.body.description
	var deadline = req.body.deadline
	var file = null

	if (!id || !description || !deadline) {
		return res.status(400).send("Id, Description, and Deadline fields are required.")
	}

	// Verify Date is in correct format and parse it
	if (!isIsoDate(deadline)) {
		return res.status(400).send("Please use valid UTC Date format: YYYY-MM-DDTHH:MN:SS.MSSZ")
	}

	deadline = new Date(deadline)

	// Add attachment to DB, using local storage for simplicity
	if (req.files) {
		file = req.files.file
		file.mv('./attachments/'+file.name, function(err) {
			if (err) {
				return res.status(400).send(err)
			} else {
				console.log("File uploaded successfully")
			}
		})
	}

	// Add to db, using local storage for simplicity
	var itemObj = new todoItem(id, description, deadline, file)
	DB[id] = itemObj
	// Since using local storage, always send success
	return res.status(200).send({[id]: itemObj})
})

// Make todo item as complete
app.patch('/complete/item/:itemId', (req, res) => {
	// Required fields verification
	const itemId = req.params.itemId
	const isComplete = req.body.isComplete

	if (!itemId || isComplete == null) {
		return res.status(400).send("itemId and isComplete fields are required.")
	}

	DB[itemId].isComplete = isComplete
	return res.status(200).send({[itemId] : DB[itemId]})
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
