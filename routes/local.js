const express = require('express')
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
    
}

const upload = multer({ 
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//retorna todos os locais
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            'SELECT * FROM local',
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                res.status(200).json({ 
                    message: 'Locais buscados', locais: resultado 
                })
            }
        )
    })
});

//retorna os dados de um local
router.get('/:id_local', (req, res, next) =>{

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            'SELECT * FROM local WHERE id_local = ?'
            [req.params.id_local],
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                res.status(200).json({ 
                    message: 'Local buscado', local: resultado 
                })
            }
        )
    }) 
})

//insere um locais
router.post('/', upload.single('imagemlocal'), (req, res, next) =>{
    console.log(req.file);
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            
            'INSERT INTO local(nome_empresa, logradouro, numero, bairro, cep, cidade, ocupacao_maxima, valor_adulto, valor_crianca, fotos, metros_quadrados, descricao, telefone, email, whatsapp, id_usuario) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [req.body.nome_empresa, req.body.logradouro, req.body.numero, req.body.bairro, req.body.cep, req.body.cidade,req.body.ocupacao_maxima, req.body.valor_adulto, req.body.valor_crianca, req.body.fotos, req.body.metros_quadrados, req.body.descricao, req.body.telefone, req.body.email, req.body.whatsapp, req.body.id_usuario],
            
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.status(201).send({
                    mensagem: "Local cadastrado " + resultado.insertId,
                })
            }
        )
    })
})

//deleta um local
router.delete('/', (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            
            'DELETE FROM local WHERE id_local = ?',
            [req.params.id_local],
            
            (error, resultado, field) => {
                
                conn.release();
                
                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    })
                }

                res.status(202).send({
                    mensagem: "Local deletado com sucesso" + resultado.id_local,
                })
            }
        ) 
    })
})

//altera um local
router.patch('/', (req, res, next) =>{
    mysql.getConnection((error, conn) => {
             
        if(error){
            return res.status(500).send({
                error: error
            })
        }
        
        conn.query(
            
            'UPDATE usuario SET nome_empresa, logradouro, numero, bairro, cep, cidade, ocupacao_maxima, valor_adulto, valor_crianca, fotos, metros_quadrados, descricao, telefone, email, whatsapp, id_usuario WHERE id_local =?',
            [req.body.nome_empresa, req.body.logradouro, req.body.numero, req.body.bairro, req.body.cep, req.body.cidade,req.body.ocupacao_maxima, req.body.valor_adulto, req.body.valor_crianca, req.body.fotos, req.body.metros_quadrados, req.body.descricao, req.body.telefone, req.body.email, req.body.whatsapp, req.body.nome_empresa, req.body.logradouro, req.body.numero, req.body.bairro, req.body.cep, req.body.cidade,req.body.ocupacao_maxima, req.body.valor_adulto, req.body.valor_crianca, req.body.fotos, req.body.metros_quadrados, req.body.descricao, req.body.telefone, req.body.email, req.body.whatsapp, req.body.id_usuario, req.params.id_local],
            
            (error, resultado, field) => {
              
                conn.release()

                if(error){
                    res.status(500).send({
                        error: error,
                        mensagem: null
                    })
                }
                
                res.status(200).send({
                    mensagem: "Local alterado com sucesso"
                })

            }
        )
    })
})

module.exports = router;