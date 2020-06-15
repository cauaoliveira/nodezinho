const express = require('express')
const router = express.Router();
const mysql = require('../mysql').pool;

//retorna todas as cidades
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            'SELECT * FROM cidade;',
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

//retorna os dados de uma cidade
router.get('/:id', (req, res, next) =>{
    
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            
            'SELECT * FROM cidade WHERE id_cidade = ?',
            [req.params.id],
            
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                res.status(200).json({ 
                    mensagem: 'Cídade Buscada', response: resultado 
                })
            }
        )
    })
})



//insere uma cidade
router.post('/', (req, res, next) =>{

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            
            'INSERT INTO cidade (nome, estado) values (?,?)',
            [req.body.nome, req.body.estado],
            
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.status(201).send({
                    mensagem: "Cidade cadastrada" + resultado.insertId,
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
            
            'DELETE FROM cidade WHERE id_cidade = ?',
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
                    mensagem: "Cidade deletada com sucesso"
                })
            }
        ) 
    })
})

//ALTERA UMA CIDADE
router.patch('/:id', (req, res, next) =>{
    
    mysql.getConnection((error, conn) => {
             
        if(error){
            return res.status(500).send({
                error: error
            })
        }  
        conn.query(
            
            'UPDATE cidade SET nome = ?, estado = ? WHERE id_cidade =?',
            [req.body.nome, req.body.estado, req.params.id],
            
            (error, resultado, field) => {
              
                conn.release()

                if(error){
                    res.status(500).send({
                        error: error,
                        mensagem: null
                    })
                }
                
                res.status(200).send({
                    mensagem: "Cidade alterada com sucesso"
                })
            }
        )
    })
})

module.exports = router;