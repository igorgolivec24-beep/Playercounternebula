const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

let onlinePlayers = 0;

app.get('/play', (req, res) => {
    onlinePlayers++;
    console.log(`Player joined. Total online: ${onlinePlayers}`);
    res.send({ status: 'ok', onlinePlayers });
});

app.get('/exit', (req, res) => {
    if (onlinePlayers > 0) {
        onlinePlayers--;
    }
    console.log(`Player left. Total online: ${onlinePlayers}`);
    res.send({ status: 'ok', onlinePlayers });
});

app.get('/count', (req, res) => {
    res.send({ onlinePlayers });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
