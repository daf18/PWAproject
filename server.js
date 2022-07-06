var path = require('path');
const fs = require('fs');
const express = require("express");
const bodyParser = require("body-parser");
var idNb = 227;

const app = express();

app.use(express.static(__dirname));

var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("Serveur démarré à http://%s:%s", host, port)
})
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());//parse seulement du json

app.get('/',(req, res) => {
	res.sendFile(path.join( __dirname , "/index.html"));//__dirname est le dossier actuel
});

app.post('/enregistrer',(req, res) => {
	//ou req.body au lieu de reponse
	reponse = {
			id: idNb,
			title: req.body.title,
            year: req.body.year,
            runtime: req.body.runtime,
            genres:  req.body.genres,
            director: req.body.director,
            actors: req.body.actors,
            plot: "",
            posterUrl:
            "client/public/images/movie.jpg"
		   };
		   //retourner au client
		   console.log(reponse);
		   strReponse=JSON.stringify(reponse); 
	let fichierJSON=path.join(__dirname ,"/client/public/ressources/films.json");
	console.log(fichierJSON);

	const json = fs.readFileSync(fichierJSON, 'utf8');
	const tabFilms = JSON.parse(json);//convertir dans un tableau
	tabFilms.push(reponse); //ajouter le nouveau dans le tableau  
	strTabFilms=JSON.stringify(tabFilms);//convertir en string 
	//écrire le tout dans le fichier
	fs.writeFileSync(fichierJSON, strTabFilms);
	  
	//retour de la réponse au client
	res.header('Content-type','application/json');
	res.header('Charset','utf8');
	res.send(strReponse);
	idNb++;
});
	