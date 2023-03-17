require('dotenv').config()
const express = require('express')
const Person = require('./models/dbPhone')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
morgan.token('body', function getBody(req, res) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get(`/info`, (request, response, next) => {

    Person.find({})
        .then(result => {
            console.log(result)
            response.send(`Phonebook has info for ${result.length} people </br>
          ${new Date()}`)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(result => response.json(result))
        .catch(error => next(error))

})
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const note = {
        name: body.name,
        number: body.number,
    }
    Person.findByIdAndUpdate(request.params.id, note, {new: true})
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({error: 'content missing'})
    }

    /* if (persons.find(p => p.name.toLowerCase().trim() === body.name.toLowerCase().trim())) {
         return response.status(400).json({error: 'name must be unique'})
     }
     */
    const newPerson = new Person({
        name: body.name,
        number: body.number
    })
    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
    })
})
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
        next(error)
    }
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port${PORT}`)
})