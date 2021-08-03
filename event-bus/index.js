const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());

const events = [];

app.post('/events', (req, res) => {
    const event = req.body;

    events.push(event);

    axios.post('http://post-cluster-ip-srv:4000/events', event); 
    axios.post('http://comments-cluster-ip-srv:4001/events', event);
    axios.post('http://query-cluster-ip-srv:4002/events', event);
    axios.post('http://moderation-cluster-ip-srv:4000/events', event);

    res.send({status: 'ok'});
});

app.get('/events', (req, res) => {
    res.send(events);
})

app.listen(4005, () => {
    console.log('v2 running');
    console.log('Event bus running on 4005');
})
