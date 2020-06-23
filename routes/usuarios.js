const express = require('express')
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer')

const upload = multer({ dest: 'uploads_usuario/'})

//retorna todos os usuarios
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            'SELECT * FROM usuario;',
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                res.status(200).json({ 
                    message: 'Usuario buscado', usuarios: resultado 
                })
            }
        )
    })
});

//retorna os dados de um usuario
router.get('/:id', (req, res, next) =>{
    
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            
            'SELECT * FROM usuario WHERE id_usuario = ?',
            [req.params.id],
            
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                res.status(200).json({ 
                    mensagem: 'Usuario buscado', response: resultado 
                })
            }
        )
    })
})



//insere um usuario
router.post('/', (req, res, next) =>{

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            
            'INSERT INTO usuario (nome, telefone, email, senha) values (?,?,?,?)',
            [req.body.nome, req.body.telefone, req.body.email, req.body.senha],
            
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.status(201).send({
                    mensagem: "Usuario cadastrado " + resultado.insertId,
                })
            }
        )
    })
})

//DELETA UM  USUARIO
router.delete('/:id', (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            
            'DELETE FROM usuario WHERE id_usuario = ?',
            [req.params.id],
            
            (error, resultado, field) => {
                
                conn.release();
                
                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    })
                }

                res.status(202).send({
                    mensagem: "Usuario deletado com sucesso"
                })
            }
        ) 
    })
})

//ALTERA UM USUARIO
router.patch('/:id', upload.single('imagem_perfil'),(req, res, next) =>{

    console.log(req.file);
    
    mysql.getConnection((error, conn) => {
             
        if(error){
            return res.status(500).send({
                error: error
            })
        }  
        conn.query(
            
            'UPDATE usuario SET nome = ?, telefone = ?, email = ?, senha = ? WHERE id_usuario =?',
            [req.body.nome, req.body, req.body.email, req.body.senha, req.params.id],
            
            (error, resultado, field) => {
              
                conn.release()

                if(error){
                    res.status(500).send({
                        error: error,
                        mensagem: null
                    })
                }
                
                res.status(200).send({
                    mensagem: "Usuario alterado com sucesso"
                })
            }
        )
    })
})

module.exports = router;