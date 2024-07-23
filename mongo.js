const mongoose = require('mongoose')
require("dotenv").config()

const url = process.env.MONGO_URI

console.log(url)

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv[3] && process.argv[4]) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
      })
      
      person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
      })
} else {
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
      })
}
