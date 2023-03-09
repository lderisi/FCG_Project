//GAME LOGIC//

var dx = 0, dz = 0;
var pxTrash = 0;
var pyTrash = 0;
var pzTrash = 0;
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
	if (!(dx <= 13 && dx >= -13 && dz <= 13 && dz >= -13)){
		return false;
	  }

	//not under fountain
	if ((dx >= 8 ) && (dx <= 16)) {
		if ((dz <= 10) && (dz >= 18)) {
			console.log("under fountain");	
			return false;
		}
	}
	
	//not under building 1 
	if ((dx >= 17) && (dx <= 25)) {
		if ((dz <= 16) && (dz >= 24)) {
			console.log("under building 5");	
			return false;
		}
	}
	
	//not under building 2 
	if ((dx >= -26) && (dx <= -13)) {
		if ((dz <= 21) && (dz >= 15)) {
			console.log("under building 4");	
			return false;
		}
	}
	
	//not under building 3 
	if ((dx >= 2) && (dx <= -20)) {
		if ((dz <= -21.5) && (dz >= -6.6)) {
			console.log("under building 3");	
			return false;
		}
	}
	
	//not under the tree
	if ((dx >= 20) && (dx <= 26)) {
		if ((dz <= -9) && (dz >= -17)) {
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