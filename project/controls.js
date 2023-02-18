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
      settings.D += 1;
      controls_render();      
    } else {
      // up
      settings.D -= 1;
      controls_render();
    }
  }


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

  
  // Click up programmable mouse button -> ON/OFF SHADOWS
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
}}*/
 

  if (e.which === 2 && !clicked) {
    clicked = true;
    // Do something when the user does middle click
    alert('Keypad on')
    window.addEventListener("keydown", function (event) {
      /*
      //W
      if(event.keyCode == 87){
        if(settings.dz>=-21.5){
          settings.dz -= 1;
          render();
      }
      }
      //S
      if(event.keyCode == 83){
        if(settings.dz>=-22){
          settings.dz += 1;
          render();
      }
      }
      //A
      if(event.keyCode == 65){
        if(settings.dx>=-21.5){
          settings.dx -= 1;
          render();
      }
      }
      //D
      if(event.keyCode == 68){
        if(settings.dx>-21.5){
          settings.dx += 1;
          render();
      }
      }
    */
        if (event.defaultPrevented) {
            return;
        }
        let newDx, newDz
        switch (event.key) {
          case "ArrowLeft": 
            if(settings.dz>=-21.5){
            angle += degToRad(2);
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
              angle -= degToRad(2);
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
    return dx <= 21.5 && dx >= -21.5 && dz <= 21.5 && dz >= -21.5
  }