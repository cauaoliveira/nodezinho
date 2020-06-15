const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParse = require('body-parser');

const rotaUsuario = require('./routes/usuarios');
const rotaLocal = require('./routes/local')
const rotaCidade = require('./routes/cidade')

app.use(morgan('dev'))
app.use(bodyParse.urlencoded({extended: false})) //apensas dados simples
app.use(bodyParse.json()); //json na entrada do body

app.use((req, res, next) => {
    res.header('Acces-Control-Allow-Origin', '*')
    res.header(
        'Acces-Control-Allow-Header', 
        'Origin, X-Requrested-With, Content-Type, Accept, Autorization',
    );
    if (req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).send({})
    }
    next();
});

//acesso as rotas
app.use('/usuarios', rotaUsuario);
app.use('/local', rotaLocal);
app.use('/cidade', rotaCidade);

//quando não encontra rota entra aqui 
app.use((req, res, next) => {
    const erro = new Error('Não encontrado')
    erro.status = 404
    next(erro);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        erro:{
            mensagem: error.message
        }
    })
})

module.exports = app;