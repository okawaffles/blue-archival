import { Logger } from 'okayulogger';
import express from 'express';
import { config } from 'dotenv';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const L = new Logger('server');
const FIRST_DATE = '2025-07-22';

if (!existsSync(join(__dirname, 'solutions.json'))) {
    L.info('solutions file does not exist, creating...');
    writeFileSync(join(__dirname, 'solutions.json'), '{"2025-07-22":"momoi"}');
}

config({path:join(__dirname, '.env')});

const app = express();
app.set('view engine', 'ejs');
app.use('/assets', express.static(join(__dirname, 'views', 'assets')));

app.get('/', (req, res) => {
    res.render('game');
});
app.get('/favicon.ico', (req, res) => {
    res.sendFile(join(__dirname, 'views', 'assets', 'images', 'favicon.png'));
});

app.get('/solution/:date', (req, res) => {
    if (!req.params || !req.params.date) return res.status(400).end();

    const date = (<string>req.params.date).split('-');
    if (isNaN(parseInt(date[0])) || isNaN(parseInt(date[1])) || isNaN(parseInt(date[2]))) return res.status(400).end();

    const num = days_since(date);
    if (num < 1) return res.status(400).end();

    const solutions: {[key: string]: string} = JSON.parse(readFileSync(join(__dirname, 'solutions.json'), 'utf-8'));
    let student: string;
    if (!solutions[req.params.date]) {
        const all_students = JSON.parse(readFileSync(join(__dirname, 'views', 'assets', 'students.json'), 'utf-8'));
        const names = Object.keys(all_students);
        student = names[Math.floor(Math.random() * names.length)];
        solutions[req.params.date] = student;
    } else student = solutions[req.params.date];

    res.json({student,num});
});

function days_since(date: string[]) {
    const f = new Date(date.join('-'));
    const n = new Date(FIRST_DATE); // game started on july 6th 2025
    const diff = f.getTime() - n.getTime();
    const days = Math.floor(diff / 86400000) + 1;
    return days;
}

app.listen(process.env.PORT);