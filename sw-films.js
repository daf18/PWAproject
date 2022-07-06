if( 'undefined' === typeof window){
  importScripts('client/public/js/librairie/idb.js')
  importScripts('client/public/js/librairie/idb-operations.js')
} 

const versionCache = '4';
const CACHE_STATIQUE = `site-statique-${versionCache}`;
const CACHE_DYNAMIQUE = `site-dynamique-${versionCache}`;


var dbPromise;
function metBd() {
  if (!dbPromise) {
    let infosBD = {
      bd: "bdfilms", stores: [{ st: "films", id: "id"},{ st: "sync-films", id: "id" },],
    };
    dbPromise = creerBD(infosBD);
  }
}

const ressources = [
  '/',
  'index.html',
  
  'https://fonts.googleapis.com/css2?family=League+Gothic&display=swap',
  'https://code.getmdl.io/1.3.0/material.min.css',
   
  'client/public/utilitaires/bootstrap-5.1.3-dist/css/bootstrap.min.css',
  'client/public/utilitaires/bootstrap-5.1.3-dist/js/bootstrap.min.js',

  'manifest.webmanifest',
  'client/public/css/style.css',
  'client/public/images/favicon.ico',

  'client/public/js/gestionFilms.js',
  'client/public/js/films-service.js',
  'client/public/js/categ-service.js',
  'client/public/ressources/bdfilms.js',
  'client/public/ressources/films.json',

  'client/public/js/sw-enregistrer.js',
  'sw-films.js',
  'client/public/js/app.js',
  'client/public/js/librairie/idb.js',
  'client/public/js/librairie/idb-operations.js'   

];

//static and dynamic cache 
self.addEventListener('install', function(event) {
    console.log("[Service Worker] En cours d'installation du SW ...", event);
    event.waitUntil(
        caches.open(CACHE_STATIQUE).then(cache => {
            cache.addAll(ressources).then(function(){
              console.log('req added to the cache');
            })
        })
    );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIQUE && key !== CACHE_DYNAMIQUE) {
            return caches.delete(key);
          }
        }));
      })
  );
});

self.addEventListener("fetch", event => {
  let url = 'http://localhost:8081/client/public/ressources/films.json';
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(fetch(event.request)
      .then((resp) => {
        var cloneResp = resp.clone();
        cloneResp.json()
          .then((donnees) => {
            for (var film of donnees) {
              enregistrer('films', film);//cet appel à besoin de dbPromise
            }
            return resp;
          })
          return resp;
      })
    )
  }
  else{ 
      event.respondWith(
      caches.match(event.request).then(response => {
        return (
          response ||
          fetch(event.request).then(resp => { 
            return caches.open(CACHE_DYNAMIQUE).then(cache => {
              cache.put(event.request.url, resp.clone());
              return resp;
            });
          })
        );
      }).catch(err => {})
    );
    }
});

self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-nouveau-film') {
    console.log('[Service Worker] sync nouveau film');
    event.waitUntil(
      contenuStore('sync-films')
        .then((listeFilms) =>  {
          for (var unFilm of listeFilms) {console.log("En SW");console.log(JSON.stringify(unFilm));
            fetch('/enregistrer', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(unFilm)
            })
              .then((res) => {console.log(res);
                //afficherDansListeFilms(leFilmEnregistre);
                if (res.ok) {
                  supprimerElement('sync-films',unFilm.id);
                }
              })
              .catch((err) => {
                console.log('Erreur avec envoyer les données', err);
              });
          }

        })
    );
  }
});
