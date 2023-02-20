//GAME LOGIC//

var pxCollection, pzCollection;
var pxTrash, pyTrash, pzTrash;
var insideArea = false; //default = red, green when the trash can be collected
var collectTrash = [false, false, false]; 
var collectedTrash = 0; 
var endGame = false;

function pickTrash() {
	if (key[4] && insideArea) { //BAR SPACE clicked
		console.log("cassonetti da ritirare n. " + (collectedTrash+1));
		key[4]=false;
		
		pxTrash = px;
		pyTrash = py;
		pzTrash = pz;
		collectedTrash++; //3
		
		if (collectedTrash < 3) {
			collectTrash[collectedTrash-1] = true;	
			console.log(collectTrash);
			console.log("cassonetto n. " + (collectedTrash) + " ritirato");
			areaTrashInit();
		}
		if (collectedTrash == 3) {
			collectTrash[collectedTrash-1] = true;
			console.log("cassonetto n. " + (collectedTrash) + " ritirato");
			console.log("fine");
			endGame = true;
			alert("Ottimo lavoro, hai ritirato tutti e tre i cassonetti. Ora puoi continuare a gironzolare per la città se vuoi.");
		}
		
		let string; 
		if (collectedTrash === 1 ) string = "Hai ritirato: " + collectedTrash + " cassonetto su 3.";
		if (collectedTrash === 2 ) string = "Hai ritirato: " + collectedTrash + " cassonetto su 3.";
		if (collectedTrash === 3 ) string = "Obiettivo raggiunto! Grazie, hai ritirato: " + collectedTrash + " cassonetti su 3.";
		document.getElementById('text').innerHTML = string;
	}
}

function areaTrashInit(){

	getRandomPositions();
	checkIfUnderBuildings();

}

function checkIfUnderBuildings() {
	//not under fountain
	if ((pxCollection >= 10 ) && (pxCollection <= 14)) {
		if ((pzCollection <= 12) && (pzCollection >= 16)) {
			console.log("under fountain");	
			getRandomPositions();
		}
	}
	
	//not under building 1 
	if ((pxCollection >= 19) && (pxCollection <= 23)) {
		if ((pzCollection <= 18) && (pzCollection >= 22)) {
			console.log("under building 5");	
			getRandomPositions();
		}
	}
	
	//not under building 2 
	if ((pxCollection >= -24) && (pxCollection <= -15)) {
		if ((pzCollection <= 23) && (pzCollection >= 13)) {
			console.log("under building 4");	
			getRandomPositions();
		}
	}
	
	//not under building 3 
	if ((pxCollection >= 0) && (pxCollection <= -18)) {
		if ((pzCollection <= -19.5) && (pzCollection >= -4.6)) {
			console.log("under building 3");	
			getRandomPositions();
		}
	}
	
	//not under the tree
	if ((pxCollection >= 22) && (pxCollection <= 24)) {
		if ((pzCollection <= -7) && (pzCollection >= -15)) {
			console.log("under tree");	
			getRandomPositions();
		}
	}
}

function getRandomPositions() {
	
	pxCollection = getRndInteger(-400, +400);
	pzCollection = getRndInteger(-400, +400);
	console.log(pxCollection, pzCollection);
}