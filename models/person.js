const mongoose = require('mongoose')
require("dotenv").config()

//const url = process.env.MONGO_URI

const url = `mongodb+srv://${process.env.USER}:${process.env.PASS}@fullstackopen.p11mir4.mongodb.net/phonebook?retryWrites=true&w=majority&appName=FullStackOpen`
console.log(url)
mongoose.set('strictQuery',false)

mongoose.connect(url)  
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 3,
      required: true
    },
    number: {
      type: String,
      required: true
    },
  })

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
module.exports = mongoose.model('Person', personSchema)