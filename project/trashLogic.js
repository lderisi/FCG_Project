//GAME LOGIC//

var dx = 0, dz = 0;
var pxTrash = 0;
var pyTrash = 0;
var pzTrash = 0;
var insideArea = false; //default = red, green when the trash can be collected
var collectTrash = [false, false, false]; 
var collectedTrash = 0; 
var endGame = false;


function pickTrash() {
		console.log("cassonetti da ritirare n. " + (2-collectedTrash));
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
			alert("Ottimo lavoro, hai ritirato tutti e tre i cassonetti. Ora puoi continuare a girare per la città se vuoi.");
		}
		
		let string; 
		if (collectedTrash === 1 ) string = "Hai ritirato: " + collectedTrash + " cassonetto su 3.";
		if (collectedTrash === 2 ) string = "Hai ritirato: " + collectedTrash + " cassonetto su 3.";
		if (collectedTrash === 3 ) string = "Obiettivo raggiunto! Grazie, hai ritirato: " + collectedTrash + " cassonetti su 3.";
		//document.getElementById('text').innerHTML = string;
}

function areaTrashInit(){

    do { 
        getRandomPositions()
    }
	while (!checkIfUnderBuildings());

}

function checkIfUnderBuildings() {
	//not under fountain
	if ((dx >= 10 ) && (dx <= 14)) {
		if ((dz <= 12) && (dz >= 16)) {
			console.log("under fountain");	
			return false;
		}
	}
	
	//not under building 1 
	if ((dx >= 19) && (dx <= 23)) {
		if ((dz <= 18) && (dz >= 22)) {
			console.log("under building 5");	
			return false;
		}
	}
	
	//not under building 2 
	if ((dx >= -24) && (dx <= -15)) {
		if ((dz <= 23) && (dz >= 13)) {
			console.log("under building 4");	
			return false;
		}
	}
	
	//not under building 3 
	if ((dx >= 0) && (dx <= -18)) {
		if ((dz <= -19.5) && (dz >= -4.6)) {
			console.log("under building 3");	
			return false;
		}
	}
	
	//not under the tree
	if ((dx >= 22) && (dx <= 24)) {
		if ((dz <= -7) && (dz >= -15)) {
			console.log("under tree");	
			return false;
		}
	}
    return true;
}

function getRandomPositions() {
	
	pxTrash = getRndInteger(-24, +24);
	pzTrash = getRndInteger(-24, +24);
	console.log(pxTrash, pzTrash);
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}