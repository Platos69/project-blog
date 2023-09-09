//CARREGANDO MODULOS
    //Modulos principais
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const { engine } = require('express-handlebars')
    const path = require("path")
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')

    //Definição de rotas
    const admin = require('./routes/admin.js')  

//CONFIGURAÇÕES
    //Sessão
        app.use(session({
            secret: 'cursodenode',
            resave: true,
            saveUninitialized: false}))
        app.use(flash())

    //Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            next()
        })

    //Body-Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())

    //Handlebars
        app.engine('handlebars', engine({defaultLayout: 'main', runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
            },
        }),
        ),
        app.set('view engine', 'handlebars')

    //Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect('mongodb://localhost/blogapp').then(() => {
            console.log('[BLOGAPP] Conectado ao banco com sucesso!')
        }).catch((erro) => {
            console.log(`[BLOGAPP] Erro ao conectar no Banco!\n Erro: ${erro}`)
        })

    //Public
        app.use(express.static(path.join(__dirname + "/public")))

        app.use((req, res, next) => {
            console.log('OI EU SOU UM MIDDLEWARE')
            next()
        })
//ROTAS
    app.use('/admin', admin)

//OUTROS
const PORT = 8081
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`)
})