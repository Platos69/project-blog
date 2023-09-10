const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')

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
        erros.push({ texto: "Nome da categoria inválido" })
    } else if (req.body.nome.length < 2) {
        erros.push({ texto: "O nome da categoria muito pequeno" })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || typeof req.body.slug == null) {
        erros.push({ texto: "Slug inválido" })
    } else if (req.body.slug.length < 2) {
        erros.push({ texto: "Slug muito pequeno" })
    }

    if (erros.length > 0) {
        res.render('admin/addcategorias', { erros: erros })
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
    Categoria.findOne({ _id: req.params.id }).then((categoria) => {
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
    Categoria.deleteOne({ _id: req.body.id }).then(() => {
        req.flash('success_msg', 'Categoria deletada com sucesso')
        res.redirect('/admin/categorias')
    }).catch((erro) => {
        req.flash('error_msg', 'Falha na exclusão da categoria')
        res.redirect('/admin/categorias')
    })
})

//Postagens
router.get('/postagens', ((req, res) => {

    Postagem.find().populate('categoria').sort({ data: 'desc' }).then((postagens) => {
        res.render('admin/postagens', { postagens: postagens })
    }).catch((erro) => {
        req.flash('error_msg', `Houve um erro ao listar as postagens ${erro}`)
        res.redirect('/admin')
    })
}))

router.get('/postagens/add', ((req, res) => {
    Categoria.find().then((categorias) => {
        res.render('admin/addpostagens', { categorias: categorias })
    }).catch((erro) => {
        req.flash('error_msg', 'Houve um error ao carregar o formulário')
        res.render('admin/postagens')
    })
}))

router.post('/postagens/nova', ((req, res) => {
    var erros = []

    if (!req.body.titulo || typeof req.body.titulo == undefined || typeof req.body.titulo == null) {
        erros.push({ texto: "Nome inválido" })
    } else if (req.body.titulo.length < 2) {
        erros.push({ texto: "Título da postagem muito pequeno" })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || typeof req.body.slug == null) {
        erros.push({ texto: "Slug inválido" })
    } else if (req.body.slug.length < 2) {
        erros.push({ texto: "Slug muito pequeno" })
    }

    if (!req.body.conteudo || typeof req.body.conteudo == undefined || typeof req.body.conteudo == null) {
        erros.push({ texto: "Conteúdo inválido" })
    } else if (req.body.slug.length < 2) {
        erros.push({ texto: "Conteúdo muito pequeno" })
    }

    if (!req.body.descricao || typeof req.body.descricao == undefined || typeof req.body.descricao == null) {
        erros.push({ texto: "Descrição inválida" })
    } else if (req.body.descricao.length < 2) {
        erros.push({ texto: "Descrição muito pequena" })
    }

    if (req.body.categoria == '0') {
        erros.push({ texto: 'Não há categorias criadas' })
    }

    if (erros.length > 0) {
        res.render('admin/addpostagens', { erros: erros })
    } else {

        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash('success_msg', 'Postagem criada com sucesso')
            res.redirect('/admin/postagens')
        }).catch((erro) => {
            req.flash('error_msg', 'Falha na criação da postagem')
            res.redirect('/admin/postagens')
        })
    }
}))


module.exports = router