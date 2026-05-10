const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Храним пары IP: LastSeenTimestamp
let players = new Map();

// Проверка неактивных пользователей каждые 30 секунд
setInterval(() => {
    const now = Date.now();
    const TIMEOUT = 150000; // 2.5 минуты (чуть больше 2 минут, чтобы избежать ложных срабатываний)
    
    for (const [ip, lastSeen] of players.entries()) {
        if (now - lastSeen > TIMEOUT) {
            players.delete(ip);
            console.log(`[Timeout] Player ${ip} removed. Online: ${players.size}`);
        }
    }
}, 30000);

app.get('/play', (req, res) => {
    // Получаем реальный IP даже за прокси Railway
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    players.set(ip, Date.now());
    console.log(`[Ping] Player ${ip} active. Total online: ${players.size}`);
    
    res.send({ status: 'ok', onlinePlayers: players.size });
});

app.get('/exit', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    if (players.has(ip)) {
        players.delete(ip);
        console.log(`[Exit] Player ${ip} left. Total online: ${players.size}`);
    }
    
    res.send({ status: 'ok', onlinePlayers: players.size });
});

app.get('/count', (req, res) => {
    res.send({ onlinePlayers: players.size });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
