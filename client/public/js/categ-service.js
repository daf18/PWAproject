async function getCategories() {
  let url = window.location.href + 'client/public/ressources/bdfilms.js';
  let reponse;
  try{
  reponse = await fetch(url);
  reponse = await reponse.json();
  }catch(err){
    reponse = [];
  }
  return reponse;
}
