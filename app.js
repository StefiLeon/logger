import express from "express";
import os from 'os';
import { createLogger } from './logger.js';

const PORT = parseInt(process.argv[2]) || 8080;
const app = express();

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

const logger = createLogger();

//MIDDLEWARE
app.use((req, res, next) => {
    logger.info(`Recibida la request ${req.method} en ${req.path}.`)
    next();
})

app.get('/', (req, res) => {
    res.send({status: 'success', message: `Bienvenido.`})
})

app.get('/error', (req, res) => {
    const { user } = req.query;
    if(!user) {
        logger.error(`No hay username ingresado en ${req.method} en la ruta ${req.path}`)
        res.send({status:'error', message: 'Usuario no valido'})
    } else {
        res.send ({status: 'success', user: user})
    }
})

app.get('/info', (req, res) => {
    res.send({
        status: 'success',
        payload: {
            args: process.argv,
            os: process.platform,
            nodeVersion: process.version,
            memory: process.memoryUsage(),
            execPath: process.execPath,
            processID: process.pid,
            projectFolder: process.cwd(),
            cores: os.cpus().length
        }
    })
})

app.use((req, res) => {
    logger.warn(`${req.method} en ruta ${req.path} no implementado.`)
    res.status(404).json({status: 'error', message: `${req.method} en ruta ${req.path} no implementado.`})
})