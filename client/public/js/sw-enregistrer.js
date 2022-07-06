if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('sw-films.js')
      .then(function() {
        console.log('Service worker enregistré!');
      }).catch(function(err) {
        console.log('Problème pour enregistrer le SW ' + err);
      });;
  }
//Désenregistrer tous les SW
  // navigator.serviceWorker.getRegistrations().then(function(registrations) {
  //   for(let registration of registrations) {
  //    registration.unregister()
  //  } })
  var promptDiffere;

  window.addEventListener('beforeinstallprompt', function(event) {
    console.log('On est dans beforeinstallprompt');
    event.preventDefault();
    promptDiffere = event;
    return false;
  });