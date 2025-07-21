"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const okayulogger_1 = require("okayulogger");
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const L = new okayulogger_1.Logger('server');
(0, dotenv_1.config)({ path: (0, path_1.join)(__dirname, '.env') });
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.use('/assets', express_1.default.static((0, path_1.join)(__dirname, 'views', 'assets')));
app.get('/', (req, res) => {
    res.render('game');
});
app.listen(process.env.PORT);
