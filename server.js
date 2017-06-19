var config = require("./config");
var documentDbClient = require("documentdb").DocumentClient;

console.log(config.primaryKey);
var client =  new documentDbClient(config.uri, { "masterKey" : config.primaryKey});

var databaseUrl = `dbs/${config.database.id}`;


var collectionUrl = `${databaseUrl}/colls/${config.collection.id}`;

console.log("databaseUrl " + databaseUrl);
console.log("collectionUrl " + collectionUrl);

