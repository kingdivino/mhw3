
const form = document.querySelector('form');
form.addEventListener('submit', search);
const api_key = 'dda1f9bccbmsh8c8820554fbf86fp10731ajsn66af763c6bf0';
const modalView = document.querySelector('#modal-view');
modalView.addEventListener('click', onModalClick);
const audio = new Audio('finito.mp3');

const options_lol = {
	method: 'GET',
	headers: {
		'content-type': 'application/octet-stream',
		'X-RapidAPI-Key': 'dda1f9bccbmsh8c8820554fbf86fp10731ajsn66af763c6bf0',
		'X-RapidAPI-Host': 'league-of-legends-champions.p.rapidapi.com'
	}
};

const options_hs = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'dda1f9bccbmsh8c8820554fbf86fp10731ajsn66af763c6bf0',
		'X-RapidAPI-Host': 'omgvamp-hearthstone-v1.p.rapidapi.com'
	}
};

const options_tw = {
	method: 'GET',
	headers: {
		'Authorization': 'Bearer fmvsohsd7w8mrcobgl86y50a8b4039',
		'Client-Id' : 'tly8csfclyj4c4sjkvm1m82yivu2op'
	}
};

function onClick(event){
	const src = event.currentTarget.querySelector("#center-view img").src;
	const cartaimg = document.createElement('img');
	cartaimg.src = src;
	document.body.classList.add('no-scroll');
	modalView.style.top = window.pageYOffset + 'px';
	modalView.appendChild(cartaimg);
	modalView.classList.remove('hidden');
}

function onModalClick(){
	modalView.classList.add('hidden');
	modalView.innerHTML = '';
	document.body.classList.remove('no-scroll');
}

function search(event)
{
  // Impedisci il submit del form
  event.preventDefault();

  // Leggi valore del campo di testo e del tipo
  const carta_input = document.querySelector('#carta');
  const carta_value = encodeURIComponent(carta_input.value);
  const tipo = document.querySelector("#tipo").value;
  console.log('Eseguo ricerca: ' + carta_value);

  //verifica del tipo ed esecuzione fecth
  if(tipo === 'hs'){
	const sfondo = document.querySelector('.sfondo');
	sfondo.style.backgroundImage = 'url(./hs_sfondo.jpg)';
	rest_url = ('https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/search/' + carta_value);
	console.log('URL: ' + rest_url);
	fetch(rest_url, options_hs).then(onResponse).then(onJson_hs);
  }
  if(tipo === 'lol'){
	rest_url = ('https://league-of-legends-champions.p.rapidapi.com/champions/it-it?page=0&size=10&name=' + carta_value);
	console.log('URL: ' + rest_url);
	fetch(rest_url, options_lol).then(onResponse).then(onJson_lol);
  }
  if(tipo === 'yugioh'){
	const sfondo = document.querySelector('.sfondo');
	sfondo.style.backgroundImage = 'url(./ygh_sfondo.jpg)';
	rest_url = ('https://db.ygoprodeck.com/api/v7/cardinfo.php?name=' + carta_value);
	console.log('URL: ' + rest_url);
	fetch(rest_url).then(onResponse).then(onJson_yugioh);
  }
  if(tipo === 'twitch'){
	rest_url = ('https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=tly8csfclyj4c4sjkvm1m82yivu2op&redirect_uri=http://localhost:3000&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls');
	//rest_url = ('https://api.twitch.tv/helix/games?name=' + carta_value);
	console.log('URL: ' + rest_url);
	fetch(rest_url/*, options_tw*/).then(onResponse).then(onJson_twitch);
  }
}

function onResponse(response) {
	console.log('Risposta ricevuta');
	//console.log(response.json());
	return response.json();
}

function onJson_twitch(json){
	const library = document.querySelector('#center-view');
	library.innerHTML = '';
	const results = json;
	console.log(json);
}

function onJson_yugioh(json){
	const library = document.querySelector('#center-view');
	library.innerHTML = '';
	const results = json;
	console.log(json);
	let num_results = results.data.length;
	for (let i=0; i<num_results; i++){
		const carta = results.data[i];
		for (let k=0; k<carta.card_images.length; k++){
			const artwork = carta.card_images[k].image_url;
			const nome = carta.name;
			const carddiv = document.createElement('div');
			carddiv.classList.add('carta');
			const img = document.createElement('img');
			img.src = artwork;
			const caption = document.createElement('span');
			caption.classList.add('caption');
			caption.textContent = nome;
			carddiv.appendChild(img);
			carddiv.appendChild(caption);
			library.appendChild(carddiv);
		}
	}
	const bottoni = document.querySelectorAll("#center-view .carta");
	for (let bottone of bottoni){
		bottone.addEventListener("click", onClick);
	}
	audio.play();
}

function onJson_lol(json){
	console.log('JSON ricevuto');

	const library = document.querySelector('#center-view');
	library.innerHTML = '';
	const results = json;
	console.log(json);
	let num_results = results.champions.length;
	for (let i=0; i<num_results; i++){
		const champion = results.champions[i].node;
		const splashart = champion.champion_splash;//champions[0].node.champion_splash
		const champion_name = champion.champion_name;
		const campione = document.createElement('div');
		campione.classList.add('campione');
		const img = document.createElement('img');
		img.src = splashart;
		const caption = document.createElement('span');
		caption.classList.add('caption');
		caption.textContent = champion_name;
		campione.appendChild(img);
		campione.appendChild(caption);
		library.appendChild(campione);
	}
	const bottoni = document.querySelectorAll("#center-view .campione");
	for (let bottone of bottoni){
		bottone.addEventListener("click", onClick);
	}
	audio.play();
}

function onJson_hs(json){
	console.log('JSON ricevuto');
	// Svuotiamo la libreria
	const library = document.querySelector('#center-view');
	library.innerHTML = '';
	const results = json;
	console.log(json);
	let num_results = results.length;
	// Processa ciascun risultato
	for(let i=0; i<num_results; i++){
		// Leggi il documento
	  	const carta_data = results[i];
	  	// Leggiamo info
	  	const images = results[i].img;
		const imagegold = results[i].imgGold;
	  	const title = carta_data.name;
		if (carta_data.img !== undefined ){
			let selected_image = images;
			
			// Creiamo il div che conterrà immagine e didascalia
			const carta = document.createElement('div');
			carta.classList.add('carta');
			// Creiamo l'immagine
			const img = document.createElement('img');
			img.src = selected_image;
			// Creiamo la didascalia
			const caption = document.createElement('span');
			caption.classList.add('caption');
			caption.textContent = title;
			// Aggiungiamo immagine e didascalia al div
			carta.appendChild(img);
			carta.appendChild(caption);
			// Aggiungiamo il div alla libreria
			library.appendChild(carta);

			//mettiamo la gold se c'è
			if(carta_data.imgGold !== undefined){
				const caption = document.createElement('span');
				caption.classList.add('caption');
				caption.textContent = title;
				let selected_gold = imagegold;
				const cartagold = document.createElement('div');
				cartagold.classList.add('carta');
				const img_gold = document.createElement('img');
				img_gold.src = selected_gold;
				cartagold.appendChild(img_gold);
				cartagold.appendChild(caption);
				library.appendChild(cartagold);
			}
			
		}
	  
	}

	const bottoni = document.querySelectorAll("#center-view .carta");
	for (let bottone of bottoni){
		bottone.addEventListener("click", onClick);
	}
	audio.play();
}



/*

https://id.twitch.tv/oauth2/authorize
    ?response_type=token
    &client_id=hof5gwx0su6owfnys0yan9c87zr6t
    &redirect_uri=http://localhost:3000
    &scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls



const url = 'https://league-of-legends-champions.p.rapidapi.com/champions/it-it?page=0&size=10&name=aatrox&role=fi';
const options = {
	method: 'GET',
	headers: {
		'content-type': 'application/octet-stream',
		'X-RapidAPI-Key': 'dda1f9bccbmsh8c8820554fbf86fp10731ajsn66af763c6bf0',
		'X-RapidAPI-Host': 'league-of-legends-champions.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'dda1f9bccbmsh8c8820554fbf86fp10731ajsn66af763c6bf0',
		'X-RapidAPI-Host': 'omgvamp-hearthstone-v1.p.rapidapi.com'
	}
};

fetch('https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/search/%7Bname%7D', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));*/