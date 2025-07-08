const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', async(req, res) => {
    console.log('This server is working well')
    res.send('Hello World')
});

// fetch all data
app.get('/users', async(req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM public.users'
        );
        res.send(result.rows);
    } catch (err) {
        console.error (err)
        res.status(500).send('Server Error');
    }
});

// Fetch data by id
app.get('/users/:id', async(req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query('SELECT * FROM public.users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Item not found');
        }
        res.send(result.rows[0])
    } catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

app.post('/users', async(req, res) => {
    const {name, email, age, id} = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO public.users (name, email, age, id) VALUES ($1, $2, $3, $4) RETURNING *', 
            [name, email, age, id]
        );
        res.status(201).send('Data posted!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update/Patch data
app.put('/users/:id', async(req, res) => {
    const {id} = req.params;
    const {name, email, age} = req.body;
    try {
        const result = await pool.query(
            'UPDATE public.users SET name = $1, email = $2, age =$3 WHERE id = $4 RETURNING *',
            [name, email, age, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Item not found')
        }
        res.send('Data updated')
    } catch (err) {
        console.error(err);
        res.status(500).send('Server not found');
    };
})

//  delete data
app.delete('/users/:id', async(req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query('DELETE FROM public.users WHERE id = $1 RETURNING *', [id])
        if (result.rows.length === 0) {
            return res.status(404).send('Items not found');
        }
        res.status(204).send('Data sucessfully deleted')
    } catch (err) {
        console.error(err);
        res.status(500).send('Server not found');
    }
})

app.listen(port, () => {
    console.log (`Server is running on port ${port}`);
})
