import { Logger } from 'okayulogger';
import express from 'express';
import { config } from 'dotenv';
import { join } from 'path';

const L = new Logger('server');

config({path:join(__dirname, '.env')});

const app = express();
app.set('view engine', 'ejs');
app.use('/assets', express.static(join(__dirname, 'views', 'assets')));

app.get('/', (req, res) => {
    res.render('game');
});

app.listen(process.env.PORT);