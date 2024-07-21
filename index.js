const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static("dist"))

morgan.token('data', (req, res) => {
    console.log(req.body)
    return JSON.stringify(req.body)
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"))


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (req, res) => {
    res.json(persons)
})

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post("/api/persons", (req, res) => {
    const newPer = req.body
    const nameExists = persons.find(person => person.name === newPer.name)
    if (nameExists) {
        res.status(400).json(
            { error: 'name must be unique' }
        )
    }

    if ((newPer.name) && (newPer.number)) {
        newPer.id = Math.floor(Math.random() * 1100).toString()
        persons = persons.concat(newPer)
        res.json(newPer)
    } else {
        res.status(400).json(
            { error: 'Person must have name and number' }
        )
    }
        
})

app.get("/info", (req, res) => {
    res.send(`<p>There is info on ${persons.length} people</p><p>${Date()}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})