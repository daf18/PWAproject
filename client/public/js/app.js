function montrerInstallBanner() {
    if (promptDiffere) {
        promptDiffere.prompt();
        promptDiffere.userChoice.then(function(choiceResult) {
        console.log(choiceResult.outcome);
        if (choiceResult.outcome === 'dismissed') {
          console.log('Installation cancellée');
        } else {
          console.log('Usager a installé notre application');
        }
      });
      promptDiffere = null;
    }
  }

  $( document ).ready(function() {
    $('#divAjouter').hide(); 
    $( "#btAjouterFilm" ).click(function() {
      $( "#divAjouter" ).toggle( "slow");
    });
});

var formAjouter=document.querySelector('#formAjouter');
var idFilm = document.querySelector('#idFilm');
var title=document.querySelector('#title');
var year=document.querySelector('#year');
var runtime=document.querySelector('#runtime');
var genres=document.querySelector('#genres');
var director=document.querySelector('#director');
var actors=document.querySelector('#actors');

formAjouter.addEventListener('submit', (event) => {
 event.preventDefault();
// validation des données
  if (title.value.trim() === '' || director.value.trim() === '') {
    alert('Vérifiez vos données!');
    return;
  }
  else{
    if ('serviceWorker' in navigator && 'SyncManager' in window) { 
      navigator.serviceWorker.ready
        .then((sw) => {//instance du SW
          film = {//film à envoyer au serveur
            //id:250,
            title: title.value,
            year: year.value,
            runtime: runtime.value,
            genres:  genres.value,
            director: director.value,
            actors: actors.value,
            plot: "Any",
            posterUrl:
            "client/public/images/movie.jpg"
         };
          //enregistrer les infos du film dans notre BD bdfilms
          enregistrer('sync-films', film)
            .then(function() {
              return sw.sync.register('sync-nouveau-film');//tag de notre Sync Task enregistré dans le SW
            })
            .then(function() {
              document.querySelector('#msg').innerHTML="Enregistré dans le store sync-films";
              setInterval(() => { document.querySelector('#msg').innerHTML=""; }, 5000);
            })
            .catch(function(err) {
              console.log(err);
            });
        });
    } else {
      ajouterFilm();//définie dans films-service.js
    }
  }
})


function afficherDansListeFilms(unFilm){
  vueListeFilms = `
  <div class="col-lg-3 col-md-4 col-sm-5" id=${unFilm.id}>
      <div class="card h-100">
      <img class="imageRatio" src="${unFilm.posterUrl}" onerror="enleverCard(${unFilm.id});" class="card-img-top img-fluid">
  
      <h6 class="FilmTitle">${
        unFilm.title.length > 25
          ? unFilm.title.substring(0, 22) + '...'
          : unFilm.title }
      </h6>
      <button type="button" class="btn btn-outline-danger">En savoir plus...
      </div>       
  </div>`;
document.getElementById("listeFilms").innerHTML+=vueListeFilms;
}
