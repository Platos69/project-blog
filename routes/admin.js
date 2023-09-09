const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('Página de posts')
})

router.get('/categorias', (req, res) => {
    res.render('admin/categorias')
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req, res) => {
    
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || typeof req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || typeof req.body.slug == null){
        erros.push({texto: "Categoria inválida"})
    }

    if (req.body.nome.length < 2) {
        erros.push({texto:"O nome da categoria muito pequeno"})
    }

    if(erros.length > 0){
        res.render('admin/addcategorias', {erros: erros})
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch((erro) => {
            req.flash('error_msg', 'Falha na criação da categoria!')
        })
    }    
})

module.exports = router