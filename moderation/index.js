const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const comments = [];

handleEvent = async (type, data) => {
    if (type === 'CommentCreated') {
        const status = data.content.match(/(Y|y)ellow/g) ? 'rejected' : 'approved';
       
        await axios.post('http://event-bus-srv:4005/events', { 
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        });
    }
}

app.post('/events', async (req, res) => {
    const {type, data} = req.body;
    handleEvent(type, data);
    res.send({});
});

app.listen(4003, async () => {
    console.log('Listening on port 4003');

    console.log('Catching up with events');

    const res = await axios.get('http://event-bus-srv:4005/events');
    
    for (let event of res.data) {
        handleEvent(event.type, event.data);
    }
});