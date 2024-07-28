const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: 'cqit9vggph6c738u1bng-a.singapore-postgres.render.com',
        user: 'fluxkart_users',
        port: 5432,
        password: 'Pt2px6NvCfBUBk5XfohWXHHxhRUY7rSG',
        database: 'fluxkartusers1',
        ssl: true
    }
})

const app = express();

let initialpath = path.join(__dirname, "public");

app.use(bodyparser.json());
app.use(express.static(initialpath));

app.get('/', (req, res) => {
    res.sendFile(path.join(initialpath, "home.html"));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(initialpath, "login.html"));
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(initialpath, "register.html"));
})

app.post('/register-user', (req, res) => {
    const { email, phone, password } = req.body;

    db.select('email', 'phone')
        .from("users")
        .where({
            email: email,
            phone: phone
        })
        .then(data => {
            if(data.length) {
                res.json("User already exists")
            }
            else {
                db("users").insert({
                    email: email,
                    phone: phone,
                    password: password,
                    linkedid: [],
                    linkedprecedence: "Primary",
                    updated_at: null
                })
                .returning(["email", "phone"])
                .then(data => {
                    res.json(data[0])
                })
            }
        })
})

app.post('/login-user', (req,res) => {
    const { emailorphone, password } = req.body;

    if(isNaN(emailorphone)) {
        db.select('email', 'phone')
        .from("users")
        .where({
            email: emailorphone,
            password: password
        })
        .then(data => {
            if(data.length){
                res.json(data[0]);
            } else{
                res.json('Incorrect credentials');
            }
        })
    }
    else {
        db.select('email', 'phone')
        .from("users")
        .where({
            phone: emailorphone,
            password: password
        })
        .then(data => {
            if(data.length){
                res.json(data[0]);
            } else{
                res.json('Incorrect credentials');
            }
        })
    }
})

app.post('/user-data', (req, res) => {
    const { email, phone } = req.body;
    if(email != null) {
        db.select()
        .from("users")
        .where({
            email: email,
            phone: phone
        })
        .then(data => {
            if(data.length){
                res.json(data[0]);
            }
            else {
                res.json('No data found');
            }
        })
    }
})

app.post('/update-data1', (req, res) => {
    const { email } = req.body;
    if(email != null) {
        db.select()
        .from("users")
        .where({
            email: email
        })
        .then(data => {
            if(data.length){
                res.json(data[0]);
            }
            else {
                res.json('NA');
            }
        })
    }
})

app.post('/update-data2', (req, res) => {
    const { phone } = req.body;
    if(phone != null) {
        db.select()
        .from("users")
        .where({
            phone: phone
        })
        .then(data => {
            if(data.length){
                res.json(data[0]);
            }
            else {
                res.json('NA');
            }
        })
    }
})

app.post('/update-db', (req, res) => {
    const { id, linkedid, linkedprecedence, updated_at } = req.body;
    db("users").where("id", id).update({
            linkedid: linkedid,
            linkedprecedence: linkedprecedence,
            updated_at: updated_at
        })
        .then(data => {
            res.json(data[0]);
        })
})

app.post('/view-data', (req, res) => {
    const { id } = req.body;
    db.select("email", "phone")
        .from("users")
        .where({
            id: id
        })
        .then(data => {
            res.json(data[0]);
        })
})

app.listen(8000, (req, res) => {
    console.log("Listening on port 8000");
});
