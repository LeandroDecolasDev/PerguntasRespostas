/*Conecta nodejs com sql, agora posso alterar o sql pelo proprio node :D */
const Sequelize = require('sequelize');

const connection = new Sequelize('projetoperguntasrespostas','root','123456',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;