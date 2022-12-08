const DEBUG = true;

const express = require('express');

const app = express();
const port = 3000;

app.use(express.static('./public'));

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => {
    console.log(`Editor listening LIVE @ http://localhost:${port}`);
    if (DEBUG) console.log('=> App running on DEBUG mode!');
})