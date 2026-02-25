const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");
const { where } = require("sequelize");


//Database
//Area para testar conexão com banco de dados
connection.authenticate()
    //Pelo que entendi o .then() é executada apenas 
    // quando a aplicação é executada com sucesso, acho que ele é como se fosse o "try"
    .then(() => {
        console.log("Conexão com Banco de Dados concluida com sucesso!");
    }).catch((msgErro) => {
        //catch roda quando dá um erro
        console.log(msgErro);
    });

//Criar a pasta "views"
/*Estou dizendo para o express usar o EJS. OBS: EJS é um construtor de html */
app.set('view engine','ejs'); 
/*Estou dizendo para o express que vou usar arquivos staticos (css,imagem, etc) */
/*"Public" é o nome da pasta  que vai ser guardado os arquivos staticos */
app.use(express.static('public'));
/*BodyParse um framework utilizado para transformar 
os dados do forms EJS para javascript e assim podermos guardar os dados */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/",(req,res) => {
    //Traduzindo a linha 33: SELECT * ALL FROM pergunta, "raw = true" informações 'cruas' passando apenas titulo e descrição
    //Traduzindo a linha 33: "order: [['id','desc']]" Ordenar pelo 'id' de maneira 'desc'(Decrecente) "asc = crescente"
    Pergunta.findAll({raw: true, order: [['id','desc']]}).then((pergunta)=>{
        res.render("index",{
        //espaço para passar variaveis para o index.ejs (html)
            pergunta: pergunta
    });//O EJS renderiza o html da pasta "views"
    });
})

app.get("/perguntar",(req,res)=>{

    res.render("perguntar",{

    });
});

app.post("/salvarpergunta",(req,res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
            descricao: descricao
    }).then(() => {
        res.redirect("/");
    });
});

app.post("/salvarresposta",(req,res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;

    Resposta.create({
        corpo: corpo,
            perguntaId: perguntaId
    }).then(() =>{
        res.redirect("/pergunta/"+perguntaId);
    })
});

app.get("/pergunta/:id",(req,res) => {
    var id = req.params.id;

    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){ //pergunta encontrada

            Resposta.findAll({order: [['id','DESC']],where:{perguntaId: pergunta.id}}).then(resposta => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    resposta: resposta
                });
            });
        }else{ //Pergunta não encontrada
            res.redirect("/");
        }
    });
});

app.listen(8080,() =>{
    console.log("App Rodando");
});