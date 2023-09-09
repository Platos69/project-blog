const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Postagem = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: Text,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'categorias', 
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('postagens', Postagem)