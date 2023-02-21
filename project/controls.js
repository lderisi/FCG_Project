let controls_render

function setControlsRender(render_) {
    controls_render = render_
}
    
function define_gui() {
  console.log("define gui")
    var gui = new dat.GUI();
    
    gui.add(settings,"D").min(4).max(100).step(0.5).onChange(function() {
      controls_render();});
    gui.add(settings,"posX").min(0).max(10).step(0.5).onChange(function() {
      controls_render();});
    gui.add(settings,"posY").min(0).max(10).step(0.5).onChange(function() {
      controls_render();});
    gui.add(settings,"posZ").min(0).max(10).step(0.5).onChange(function() {
      controls_render();});
    gui.add(settings,"targetX").min(0).max(5).step(0.5).onChange(function() {
      controls_render();});
    gui.add(settings,"targetY").min(-1).max(5).step(0.5).onChange(function() {
      controls_render();});
    gui.add(settings,"targetZ").min(0).max(5).step(0.5).onChange(function() {
      controls_render();});
    gui.add(settings,"projWidth").min(0).max(7).step(0.5).onChange(function() {
      controls_render();});
    gui.add(settings,"projHeight").min(0).max(7).step(0.5).onChange(function() {
      controls_render();});
    gui.add(settings,"bias").min(-0.01).max(0.001).step(0.0001).onChange(function() {
      controls_render();});
    gui.add(settings,"lightFieldOfView").min(60).max(120).step(5).onChange(function() {
      controls_render();});
    gui.add(settings,"dx").min(-24).max(24).step(0.1).onChange(function() {
      controls_render();});
    gui.add(settings,"dz").min(-23).max(23).step(0.1).onChange(function() {
      controls_render();});
    gui.add(settings,"scaleX").min(0.1).max(6).step(0.1).onChange(function() {
        controls_render();});
    gui.add(settings,"scaleY").min(0.1).max(6).step(0.1).onChange(function() {
        controls_render();});
    gui.add(settings,"scaleZ").min(0.1).max(6).step(0.1).onChange(function() {
        controls_render();});
    gui.add(settings,"spotLight").onChange(function() {
      controls_render();});
    gui.add(settings,"lightFrustum").onChange(function() {
      controls_render();});
    gui.add(settings,"shadows").onChange(function() {
      controls_render();});

    gui.close();
  } 


  var THETA = degToRad(10), PHI = degToRad(50);
  var drag, old_x, old_y, dX, dY;
  
  function attachEvents() {
    console.log("attach events")
    canvas.addEventListener("mouseup", function(e) {
      drag = false;
  }, false)

  canvas.addEventListener("mousemove", function(e) {
      if (!drag) {
          return false; 
      }
      dX = -(e.pageX - old_x) * 2 * Math.PI / canvas.width; 
      dY = -(e.pageY - old_y) * 2 * Math.PI / canvas.height; 
      THETA += dX;
      PHI += dY;
      old_x = e.pageX;
      old_y = e.pageY; 
      e.preventDefault();
      controls_render();
  }, false);

  // MOUSE WHEEL
  canvas.onwheel = function(event) {
    if (event.deltaY > 0) {
      // down
      //if(settings.D < 100){
      settings.D += 1;
      controls_render();      
    //}
  } else {
      // up
      if(settings.D > 4){
      settings.D -= 1;
      controls_render();
    }
  }}


  let clicked = false;
//CLICK WHEEL
// Whenever the user starts pressing any mouse button
canvas.addEventListener('mousedown', e => {
  // Check if the click is the middle button
  if(e.which !== 2 && e.which !== 4 && e.which !== 5)  
  drag = true;
  old_x = e.pageX
  old_y = e.pageY;
  e.preventDefault();
  console.log(e);

  
  // Click up programmable mouse button -> ON/OFF SHADOWS oppure FIRST PERSON+FOLLOW
  if(e.which === 5){
    THETA = degToRad(-10), PHI = degToRad(-50);
    //settings.shadows = true;
    controls_render();
}
  /*
  if(e.which === 4){
    if(settings.shadows = true){
    THETA = degToRad(100), PHI = degToRad(500);
    render();
  }}
  */
 

  if (e.which === 2 && !clicked) {
    clicked = true;
    // Do something when the user does middle click
    alert('START GAME - Raccogli i tre cassonetti che compariranno in giro per la città.')
    window.addEventListener("keydown", function (event) {
      
      if(event.keyCode == 32){
        console.log("Barra spaziatrice");
        console.log(Math.abs(settings.dx-pxTrash),Math.abs(settings.dz-pzTrash));
      if(Math.abs(settings.dx-pxTrash) < 2 && Math.abs(settings.dz-pzTrash) < 2){
        console.log("Raccolgo");
        pickTrash();
      }
      }

      //W
      if(event.keyCode == 87){
        THETA = degToRad(0), PHI = degToRad(50);
        controls_render();
      }
      //S
      if(event.keyCode == 83){
        THETA = degToRad(360), PHI = degToRad(-50);
        controls_render();
      }
      //A
      if(event.keyCode == 65){
        THETA = degToRad(90), PHI = degToRad(-50);
        controls_render();
      }
      //D
      if(event.keyCode == 68){
        THETA = degToRad(270), PHI = degToRad(-50);
        controls_render();
      }
      
    
        if (event.defaultPrevented) {
            return;
        }
        let newDx, newDz
        switch (event.key) {
          case "ArrowLeft": 
            if(settings.dz>=-21.5){
            angle += degToRad(3.5);
              controls_render();
              }
              break;
          case "ArrowUp": 
              newDx = settings.dx - Math.sin(angle)
              newDz = settings.dz - Math.cos(angle)
              if(checkPosition(newDx, newDz)){
              settings.dx = newDx;
              settings.dz = newDz;
              controls_render();
          }
              break;
          case "ArrowRight":
              if(settings.dz>=-21.5){
              angle -= degToRad(3.5);
              controls_render();
              }
              break;
          case "ArrowDown": 
              newDx = settings.dx + Math.sin(angle)
              newDz = settings.dz + Math.cos(angle)
              if(checkPosition(newDx, newDz)){
              settings.dx = newDx;
              settings.dz = newDz;
              controls_render();
          }
              break;
          default:
              return; 
      }
      event.preventDefault(); 
    }, true);
    // Prevent default middle click behaviour of the middle click
    e.preventDefault()
  }
})

canvas.addEventListener("touchstart", function (e) {
    drag = true;
    old_x =  e.touches[0].clientX;
    old_y =  e.touches[0].clientY;
    e.preventDefault();  
}, false);

canvas.addEventListener("touchend", function (e) {
    drag = false;
}, false);

canvas.addEventListener("touchmove", function (e) {
    if (!drag) {
        return false; 
    }
    dX = -(e.touches[0].clientX - old_x) * 2 * Math.PI / canvas.width; 
    dY = -(e.touches[0].clientY - old_y) * 2 * Math.PI / canvas.height; 
    THETA += dX;
    PHI += dY;
    old_x = e.touches[0].clientX;
    old_y = e.touches[0].clientY;
    e.preventDefault();
    controls_render();
}, false);
  }

  function checkPosition(dx, dz) {
    console.log(dx,dz);
  if (!(dx <= 21.5 && dx >= -21.5 && dz <= 21.5 && dz >= -21.5)){
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