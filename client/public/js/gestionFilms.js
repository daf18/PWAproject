async function remplirTabFilms(reponse){
  if(reponse.length>0){
    tabFilms=reponse;
  }else{
    tabFilms= await contenuStore('films');
  }
}
async function chargerFilms() {
  reponse = await getFilms();
    await remplirTabFilms(reponse)
  

  let listeCards = '';
  for (let unFilm of tabFilms) {
    listeCards += creerCard(unFilm);
  }
  document.getElementById('contenu').innerHTML = listeCards;
}

// rempli les categories des films
async function chargerCategorie(par) {
  if (par === 'fetch') {
    await getCategories().then(reponse => {
      tabCategories = reponse;
    });
  }

  let listeCateg = ``;
  for (let categ of tabCategories) {
    listeCateg += `<li onclick=categorieChoisie("${categ}")><a class="dropdown-item" onclick="" href="#">${categ}</a></li>`;
  }
  document.getElementById('movieCateg').innerHTML = listeCateg;
}

let categorieChoisie = categ => {
  let content = '';
  for (let unFilm of tabFilms) {
    for (i = 0; i < unFilm.genres.length; i++) {
      if (unFilm.genres[i] === categ) {
        content += creerCard(unFilm);
      }
    }
  }
  document.getElementsByTagName('body')[0].innerHTML = content;
};

let enleverCard = idCard => {
  document.getElementById(idCard).style.display = 'none';
  document.getElementById(idCard).remove();
};

let creerCard = unFilm => {
  let uneCard = `
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
  return uneCard;
};
