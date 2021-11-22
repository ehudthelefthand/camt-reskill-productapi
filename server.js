const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')

const port = 3002
let db = {}
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.get('/', (req, res) => res.send('ok'))

app.post('/users/:name/products', (req, res) => {
    const name = String(req.params.name)
    const { title, price, currency, stock, sku } = req.body
    const product = { id: uuidv4(), title, price, currency, stock, sku }
    if (name in db) {
        db[name].push(product)
    } else {
        db[name] = [product]
    }
    res.sendStatus(201)
})

app.get('/users/:name/products', (req, res) => {
    const name = String(req.params.name)
    if (name in db) {
        res.json(db[name])
    } else {
        res.status(404).json({
            message: 'name not found'
        })
    }
})

app.get('/users/:name/products/:id', (req, res) => {
    const name = String(req.params.name)
    const id = String(req.params.id)
    if (name in db) {
        const products = db[name]
        const index = products.findIndex(p => p.id === id)
        if (index !== 1) {
            res.json(products[index])
        } else {
            res.status(404).json({
                message: 'id not found'
            })
        }
    } else {
        res.status(404).json({
            message: 'name not found'
        })
    }
})

app.put('/users/:name/products/:id', (req, res) => {
    const name = String(req.params.name)
    const id = String(req.params.id)
    const { title, price, currency, stock, sku } = req.body
    if (name in db) {
        const products = db[name]
        const index = products.findIndex(p => p.id === id)
        if (index !== -1) {
            products.splice(index, 1, { id, title, price, currency, stock, sku })
            db[name] = products
            res.sendStatus(200)
        } else {
            res.status(404).json({
                message: 'id not found'
            })
        }
    } else {
        res.status(404).json({
            message: 'name not found'
        })
    }
})

app.delete('/users/:name/products/:id', (req, res) => {
    const name = String(req.params.name)
    const id = String(req.params.id)
    if (name in db) {
        const products = db[name]
        const index = products.findIndex(todo => todo.id === id)
        if (index !== -1) {
            products.splice(index, 1)
            db[name] = products
            res.sendStatus(200)
        } else {
            res.status(404).json({
                message: 'id not found'
            })
        }
    } else {
        res.status(404).json({
            message: 'name not found'
        })
    }
})

app.post('/users/:name/reset', (req, res) => {
    const name = String(req.params.name)
    if (name in db) {
        db[name] = []
        res.sendStatus(200)
    } else {
        res.status(404).json({
            message: 'name not found'
        })
    }
})

app.post('/reset', (req, res) => {
    db = {}
    res.sendStatus(200)
})

app.get('/all', (req, res) => {
    res.json(db)
})

app.listen(port, () => console.log(`server started at ${port}`))