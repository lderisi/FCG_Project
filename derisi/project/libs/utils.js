function textureFromImage(gl, fileName){
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255])); 
    var image = new Image();
    image.src = fileName;
    
    image.addEventListener('load', function() {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  
      checkIfMipmap(gl, image);
    });
    return texture;
  }
  
  function checkIfMipmap(gl, image) {
    
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } 
    else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  
  }
  
  function loadDoc(url) {
    var xhttp = new XMLHttpRequest();
  
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4) {
            result = xhttp.responseText;
        }
    };
    xhttp.open("GET", url, false);
    xhttp.send(null);
  }
  
  
  
  
  function degToRad(deg) {
      return deg * Math.PI / 180;
  }
  
  function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }