const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
morgan.token('body', function getBody (req,res) {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    console.log(req, res)
    res.json(persons)
})

app.get(`/info`, (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people 
    <br/><br/>
    ${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    if(!persons.find(p => p.id === id)){
        response.status(404).json({error: 'You can\'t delete a user that doesn\'t exist'})
    }
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

generateId = () => {
    const id = Math.trunc(Math.random() * 1e7)
    return id
}
app.post('/api/persons', (request, response) => {
        const body = request.body

        if (!body.name || !body.number) {
            return response.status(400).json({error: 'content missing'})
        }
        if (persons.find(p => p.name.toLowerCase().trim() === body.name.toLowerCase().trim())) {
            return response.status(400).json({error: 'name must be unique'})
        }
        const newPerson = {
            id: generateId(),
            name: body.name,
            number: body.number

        }
        response.json(newPerson)
        persons = persons.concat(newPerson)
    }
)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port${PORT}`)
})