var config = require("./config");
var documentDbClient = require("documentdb").DocumentClient;

console.log(config.primaryKey);
var client =  new documentDbClient(config.uri, { "masterKey" : config.primaryKey});

var databaseUrl = `dbs/${config.database.id}`;
var collectionUrl = `${databaseUrl}/colls/${config.collection.id}`;
var HttpStatusCodes = { NOTFOUND: 404};

console.log("databaseUrl " + databaseUrl);
console.log("collectionUrl " + collectionUrl);

//createDatabaseIfNotExists(config.documents);
//query();
//replace(config.documents[0])
//deleteDocument(config.documents[0].id)

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

function createDocumentIfNotExists(documents){

  console.log("createDocumentIfNotExists function");

  for (let i = 0; i < documents.length; i++) {
    let documentUrl = collectionUrl + "/docs/" + documents[i].id;

    console.log("documentUrl" + documentUrl);

    client.readDocument(documentUrl, null, (err, result) => {
      if (err) {
        if (err = HttpStatusCodes.NOTFOUND) {

          client.createDocument(collectionUrl, documents[i], (err, created) => {
            if (err) {
              console.log('Error on creation' + JSON.stringify(err));
            }else {
              console.log('Document created' + JSON.stringify(created));
            }
          });


        }else {
          console.log('Error except NOTFOUND' + JSON.stringify(err));
        }
      }else {
        console.log('result is' + JSON.stringify(result)+"\n");
      }
    });
  }

}

function query(){
  console.log("query function");
  console.log("collectionUrl" + collectionUrl);

  client.queryDocuments(collectionUrl,
    "Select * from root r").toArray((err, results) => {
      if (err) {
        console.log("collectionUrl" + JSON.stringify(err));
      }else {
        for (let result of results) {
          console.log("Value" + JSON.stringify(result) + "\n");
        }
      }
    });

}

function replace(doc){
  let documentUrl = collectionUrl+"/docs/"+doc.id;

  console.log(documentUrl);
  console.log(JSON.stringify(doc));

  doc.name = "new Alex";

  client.replaceDocument(documentUrl, doc, (err, result) => {
    if (err) {
      console.log(JSON.stringify(err));
    }else {
      console.log(JSON.stringify(doc));
    }
  });

}

function deleteDocument(id){

  let documentUrl = collectionUrl+"/docs/"+id;

  client.deleteDocument(documentUrl, (err, result) => {
    if (err) {
      console.log(JSON.stringify(err));
    }else {
      console.log(JSON.stringify(result));
    }
  });

}

function deleteDatabase(){
  client.deleteDatabase(databaseUrl, (err) => {
    if (err) {
      console.log(JSON.stringify(err));
    }
  });
}
