const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')

//ROTAS

    //Principal
    router.get('/', (req, res) => {
        res.render('admin/index')
    })

    //Categorias
    router.get('/categorias', (req, res) => {
            Categoria.find().sort({ data: 'desc' }).then((categorias) => {
                res.render('admin/categorias', { categorias: categorias })
        }).catch((erro) => {
            req.flash(`error_msg', 'Houve um error ao listar as categorias`)
            res.redirect('/admin')
        })
    })

    router.get('/categorias/add', (req, res) => {
        res.render('admin/addcategorias')
    })

    router.post('/categorias/nova', (req, res) => {

        var erros = []

        if (!req.body.nome || typeof req.body.nome == undefined || typeof req.body.nome == null) {
            erros.push({ texto: "Nome inválido" })
        }

        if (!req.body.slug || typeof req.body.slug == undefined || typeof req.body.slug == null) {
            erros.push({ texto: "Slug da categoria inválida" })
        }

        if (req.body.nome.length < 2) {
            erros.push({ texto: "O nome da categoria muito pequeno" })
        }

        if (erros.length > 0) {
            res.render('admin/categorias', { erros: erros })
        } else {
            const novaCategoria = {
                nome: req.body.nome,
                slug: req.body.slug
            }

            new Categoria(novaCategoria).save().then(() => {
                req.flash('success_msg', 'Categoria criada com sucesso')
                res.redirect('/admin/categorias')
            }).catch((erro) => {
                req.flash('error_msg', 'Falha na criação da categoria')
                res.redirect('/admin/categorias')
            })
        }
    })

    router.get('/categorias/edit/:id', (req, res) => {
        Categoria.findOne({ _id:req.params.id }).then((categoria) => {
            res.render('admin/editcategorias', { categoria: categoria })
        }).catch((erro) => {
            req.flash('error_msg', 'Está categoria não existe')
            res.redirect('/admin/categorias')
        })
    })

    router.post("/categorias/edit", (req, res) => {
        Categoria.findOne({ _id: req.body.id }).then((categoria) => {
            let erros = []

            if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
                erros.push({ texto: "Nome inválido" })
            }
            if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
                erros.push({ texto: "Slug inválido" })
            }
            if (req.body.nome.length < 2) {
                erros.push({ texto: "Nome da categoria muito pequeno" })
            }

            if (erros.length > 0) {
                res.render("admin/categorias", { categoria: categoria, erros: erros })
            } else {
                categoria.nome = req.body.nome
                categoria.slug = req.body.slug

                categoria.save().then(() => {
                    req.flash("success_msg", "Categoria editada com sucesso")
                    res.redirect("/admin/categorias")
                }).catch((erro) => {
                    req.flash("error_msg", "Erro ao salvar a edição da categoria")
                    res.redirect("/admin/categorias")
                })
            }
        }).catch((erro) => {
            req.flash("error_msg", `Erro ao editar a categoria`)
            res.redirect("/admin/categorias")
        })
    })

    router.post('/categorias/deletar', (req, res) => {
        Categoria.deleteOne({_id: req.body.id}).then(() => {
            req.flash('success_msg', 'Categoria deletada com sucesso')
            res.redirect('/admin/categorias')
        }).catch((erro) => {
            req.flash('error_msg', 'Falha na exclusão da categoria')
            res.redirect('/admin/categorias')
        })
    })

    //Postagens
    router.get('/postagens', ((req, res) => {
        res.render('admin/postagens')
    }))

    router.get('/postagens/add', ((req, res) => {
        Categoria.find().then((categorias) => {
            res.render('admin/addpostagens', {categorias: categorias})
        }).catch((erro) => {
            req.flash('error_msg', 'Houve um error ao carregar o formulário')
            res.render('admin/postagens')
        })
    }))



module.exports = router