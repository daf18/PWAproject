async function getFilms() {
  let url = 'http://localhost:8081/client/public/ressources/films.json';
  let reponse;
  try{
    reponse = await fetch(url);
    reponse = await reponse.json();
  }catch(err){
    reponse=[];
  }
  return reponse;
}

function ajouterFilm() {
  var formData = new FormData(document.getElementById('formAjouter'));
  console.log(formData); 
  
  fetch('/enregistrer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(Object.fromEntries(formData))
  })
  .then(response => response.json())
  .then( donnees => {
      afficherDansListeFilms(donnees);
  })
  .catch(err => console.log(err))
}