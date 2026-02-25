const Sequelize = require('sequelize');
const connection = require("./database");

//Criando uma tabela "pergunta" no sql
const Pergunta = connection.define('pergunta',{

    titulo:{    //O "type: Sequelize.STRING" é para textos curtos 
        type: Sequelize.STRING,
        allowNull: false
    },

    descricao:{// O "type: Sequelize.TEXT" é para textos mais longos
        type: Sequelize.TEXT,
        allowNull: false
    }
});
//
Pergunta.sync({force: false}).then(() => {console.log("Tabela Pergunta criada")});

module.exports = Pergunta;