const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const posts = {};

app.get('/', (req, res) => {
    res.send('Posts services');
})
 
app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
 
    posts[id] = {
        id, title
    }
    // emit event to bus
    await axios.post('http://event-bus-srv:4005/events', {
        type: 'PostCreated',
        data: {id, title}
    })

    res.status(201).send(posts[id]);
});

app.get('/posts/:id', (req, res) => {
    const { id } = req.params;
    const post = posts[id] || [];
    res.send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log('Received event', req.body.type);
    res.send({});
});
 
app.listen(4000, () => {
    console.log('V3 running');
    console.log('post service listening on port 4000')
});