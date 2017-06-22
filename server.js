var config = require("./config");
var documentDbClient = require("documentdb").DocumentClient;

console.log(config.primaryKey);
var client =  new documentDbClient(config.uri, { "masterKey" : config.primaryKey});

var databaseUrl = `dbs/${config.database.id}`;
var collectionUrl = `${databaseUrl}/colls/${config.collection.id}`;
var HttpStatusCodes = { NOTFOUND: 404};

console.log("databaseUrl " + databaseUrl);
console.log("collectionUrl " + collectionUrl);

createCollectionIfnotExists();

function createDatabaseIfNotExists(){
  console.log("databaseUrl" + databaseUrl);

  client.readDatabase(databaseUrl, (err, result) => {
    if(err){
      if (err.code == HttpStatusCodes.NOTFOUND) {
        client.createDatabase(config.database, (err, created ) => {
          if (err) {
            console.log(JSON.stringify(err));
          }else {
            console.log("database created", JSON.stringify(created));
          }
        });
      }else {
        console.log("database created" , JSON.stringify(result));
      }
    }
  });
}

function createCollectionIfnotExists(){
  console.log("Getting collection: " + config.collection.id);

  client.readCollection(collectionUrl, (err, result) => {
    if (err) {
      if (err.code == HttpStatusCodes.NOTFOUND) {
        client.createCollection(databaseUrl, config.collection, {offerThroughput: 1000}, (e, c) => {
          if (err) {
            console.log("Error :" + JSON.stringify(e) );
          }else {
            console.log("Created : " + JSON.stringify(c) );
          }
        });
      }
    }else {
      console.log("result collection:" + JSON.stringify(result) );
    }
  });

}
