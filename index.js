const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static("dist"))

morgan.token('data', (req, res) => {
    console.log(req.body)
    return JSON.stringify(req.body)
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"))

app.get("/api/persons", (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id
    Person.findById(id).then(person => {
        res.json(person)
    })
})

app.delete("/api/persons/:id", (req, res, next) => {
    const id = req.params.id

    Person.findByIdAndDelete(id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
    const id = req.params.id
    const newPer = {
        name: req.body.name,
        number: req.body.number
    }

    Person.findByIdAndUpdate(id, newPer, {new: true, runValidators: true, context: 'query'})
        .then(person => {
            console.log(person)
            res.json(person)
        })
        .catch(error => next(error))
})

app.post("/api/persons", (req, res, next) => {
    const newPer = req.body

    const person = new Person({
        name: newPer.name,
        number: newPer.number,
      })
    
      person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))
})

app.get("/info", (req, res) => {
    Person.find({}).then(persons => {
        res.send(`<p>There is info on ${persons.length} people</p><p>${Date()}</p>`)
    })
})

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: "malformed id" })
    } else if (error.name === 'ValidationError') {
        return res.status(400).send({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})