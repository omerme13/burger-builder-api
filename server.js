const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const orders = require('./controllers/orders');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const ingredients = require('./controllers/ingredients').initialIngredients;

const verifyToken = require('./middleware/verifyToken').verifyToken;

// linux: user = omer, password = 1234
// windows: user = postgres, password = '' 
let user = 'omer';
let password = '1234';
if (process.platform === 'win32') {
    user = 'postgres';
    password = '';  
}    

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: user,
        password: password,
        database: 'burgerbuilder'
    }
});

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get('/ingredients', (req, res) => {
    res.send(ingredients)
});

app.post('/orders', verifyToken, (req, res) => {
    orders.postOrderHandler(req, res, db);
});

app.get('/orders', verifyToken, (req, res) => {
    orders.getOrdersHandler(req, res, db);
});

app.post('/register', (req, res) => {
    register.registerHandler(req, res, db, bcrypt);
});

app.post('/signin', (req, res) => {
    signin.signinHandler(req, res, db, bcrypt, jwt);
});


app.listen(3000);