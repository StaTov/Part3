const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

console.log('connecting to', process.env.MONGODB_URL)
mongoose.connect(process.env.MONGODB_URL)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phoneSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /^\d{2}-\d{6,20}/.test(v) || /^\d{3}-\d{5,21}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number! Example: xx-xxxxxx or xxx-xxxxx`
    },
    required: [true, 'User phone number required']
  }
})

phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', phoneSchema)