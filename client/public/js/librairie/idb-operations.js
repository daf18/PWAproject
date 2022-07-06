var dbPromise;
function metDb() {
  if (!dbPromise) {
    let infosBD = { 
      bd: "bdfilms", stores: [{ st: "films", id: "id",autoIncrement:true },{ st: "sync-films", id: "id",autoIncrement:true },],
    };
    dbPromise = creerBD(infosBD);
  }
}

async function creerBD(infosBD) {

  return await idb.open(infosBD.bd, 1, (db) => {
    //retourne une Promise de la BD
    let listeStores = infosBD.stores;
    for (unSt of listeStores) {
      if (!db.objectStoreNames.contains(unSt.st)) {
        //films la «table»
        db.createObjectStore(unSt.st, { keyPath: unSt.id,autoIncrement:true}); //FIXME ,autoIncrement:true
      }
    }
  });
}

function enregistrer(st, donnees) {
  metDb();
  return dbPromise.then((db) => {
    var tx = db.transaction(st, "readwrite");
    var store = tx.objectStore(st);
    store.put(donnees);
    return tx.complete;
  });
}

function contenuStore(st) {
  metDb();
  return dbPromise.then((db) => {
    var tx = db.transaction(st, "readonly");
    var store = tx.objectStore(st);
    return store.getAll();
  });
}

//Autres fonctions utilitaires
function viderStore(st) {
  return dbPromise.then(function (db) {
    var tx = db.transaction(st, "readwrite");
    var store = tx.objectStore(st);
    store.clear();
    return tx.complete;
  });
}

function supprimerElement(st, id) {
  dbPromise
    .then(function (db) {
      var tx = db.transaction(st, "readwrite");
      var store = tx.objectStore(st);
      store.delete(id);
      return tx.complete;
    })
    .then(function () {
      console.log("Elément supprimé");
    });
}
