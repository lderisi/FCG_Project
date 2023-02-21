'use strict';
var angle = 0;

async function main() {
  
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById('canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    return;
  }

  const ext = gl.getExtension('WEBGL_depth_texture');
  if (!ext) {
    return alert('need WEBGL_depth_texture');
  }

  setControlsRender(render)
  define_gui();
  attachEvents()
  
  const sceneProgramInfo = webglUtils.createProgramInfo(gl, ['vertex-shader-3d', 'fragment-shader-3d']);
  const colorProgramInfo = webglUtils.createProgramInfo(gl, ['color-vertex-shader', 'color-fragment-shader']);
  const universeProgramInfo = webglUtils.createProgramInfo(gl, ['universe-vs', 'universe-fs']);

 
  txt[0] = textureFromImage(gl, PATH_MAP);
  txt[1] = textureFromImage(gl, PATH_SKY);
  txt[2] = textureFromImage(gl, PATH_LUCA);
  txt[3] = textureFromImage(gl, PATH_GLASS);
  txt[4] = textureFromImage(gl, PATH_TV);
  txt[5] = textureFromImage(gl, PATH_BUILD);
  txt[6] = textureFromImage(gl, PATH_TREE);
  txt[7] = textureFromImage(gl, PATH_DUMPSTER);

 

  //await new Promise(r => setTimeout(r, 2000));

  const planeBufferInfo = primitives.createPlaneBufferInfo(
    gl,
    10,  
    10,  
    1, 
    1,
);

  const cubeLinesBufferInfo = webglUtils.createBufferInfoFromArrays(gl, {
    position: [
      -1, -1, -1,
       1, -1, -1,
      -1,  1, -1,
       1,  1, -1,
      -1, -1,  1,
       1, -1,  1,
      -1,  1,  1,
       1,  1,  1,
    ],
    indices: [
      0, 1,
      1, 3,
      3, 2,
      2, 0,

      4, 5,
      5, 7,
      7, 6,
      6, 4,

      0, 4,
      1, 5,
      3, 7,
      2, 6,
    ],
  });


  // ------- LOAD OBJ MODELS ------ //
  // TRUCK MODEL
  const parts = await load_obj(gl,'data/truck_de_risi.obj');

  // FOUNTAIN MODEL
  const parts_tv = await load_obj(gl,'data/Fountain.obj',false);

  //BUILDING 1
  const parts_build = await load_obj (gl,'data/building2.obj',false);

  //BUILDING 2
  const parts_build1 = await load_obj(gl,'data/building.obj',false);
    
  //BUILDING 3
  const parts_build3 = await load_obj(gl,'data/building.obj',false);

  // OTHER SCENE OBJECTS
  // TREE MODEL
  const parts_tree = await load_obj(gl,'data/pino.obj',false);

  const parts_dumpster = await load_obj(gl,'data/dumpster_finale.obj',false);
  

  // ------ UNIFORMS ------ //
  const ceilingUniforms = createUniform(null,null,txt[LUCA],m4.scale(m4.xRotate(m4.translation(0, 50, 0),3.14159),5,5,5));
  
  const floorUniforms = createUniform([1, 1, 1, 1],[1, 1, 1, 1],txt[MAP],m4.scale(m4.translation(0,0,0),5,5,5))

  //FRONT
  const wallUniforms1 = createUniform([1, 0.5, 1, 1],[1, 1, 1, 1],txt[SKY],m4.scale(m4.xRotate(m4.translation(0, 25, 25),-1.5708),5,5,5))

  //SX
  const wallUniforms2 = createUniform([1, 1, 1, 1],[1, 1, 1, 1],txt[SKY],m4.scale(m4.yRotate(m4.zRotate(m4.translation(25, 25, 0),degToRad(90)),degToRad(90)),5,5,5)) 
 
  //DX
  const wallUniforms3 = createUniform([1, 1, 1, 1],[1, 1, 1, 1],txt[SKY],m4.scale(m4.yRotate(m4.zRotate(m4.translation(-25, 25, 0),degToRad(-90)),degToRad(-90)),5,5,5)) 
 
  //BACK
  const wallUniforms4 = createUniform([1, 1, 1, 1],[1, 1, 1, 1],txt[SKY],m4.scale(m4.yRotate(m4.xRotate(m4.translation(0, 25, -25),degToRad(90)),degToRad(180)),5,5,5))

  var truckUniforms = createUniform(null,null,null,m4.yRotate(m4.translation(0, 0, 0),3.1415))
  
  const fountainUniforms = createDiffuseUniform(m4.scale(m4.yRotate(m4.translation(11.7, 2.2, 15.5),3.1415),1.5,1.5,1.5),txt[ACQUA])

  const buildingUniforms = createDiffuseUniform(m4.scale(m4.yRotate(m4.translation(-9, 0, -11.8),degToRad(90)),1.5,2.5,1.5),txt[GLASS])
  
  const buildingUniforms1 = createDiffuseUniform(m4.scale(m4.yRotate(m4.translation(-20, 0, 20),3.1415),0.04,0.04,0.04),txt[BUILD]) 
  
  const buildingUniforms3 = createDiffuseUniform(m4.scale(m4.yRotate(m4.translation(20, 0, 20),3.1415),0.025,0.025,0.025),txt[BUILD])

  const treeUniforms = createDiffuseUniform(m4.scale(m4.xRotate(m4.translation(22, 0, -12),degToRad(-90)),1,1,1),txt[TREE])

  areaTrashInit();

  let dumpsterUniforms = createDiffuseUniform (m4.translation(pxTrash, pyTrash, pzTrash),txt[DUMPSTER])

  // SOME BASE AND SHADOWS SETTINGS
  const depthTexture = gl.createTexture();
  const depthTextureSize = 512;
  gl.bindTexture(gl.TEXTURE_2D, depthTexture);
  gl.texImage2D(
      gl.TEXTURE_2D,      
      0,                  
      gl.DEPTH_COMPONENT, 
      depthTextureSize,   
      depthTextureSize,   
      0,                  
      gl.DEPTH_COMPONENT, 
      gl.UNSIGNED_INT,    
      null);              
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const depthFramebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
  gl.framebufferTexture2D(
      gl.FRAMEBUFFER,       
      gl.DEPTH_ATTACHMENT, 
      gl.TEXTURE_2D,        
      depthTexture,         
      0);                   

  const unusedTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, unusedTexture);
  gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      depthTextureSize,
      depthTextureSize,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


  gl.framebufferTexture2D(
      gl.FRAMEBUFFER,        
      gl.COLOR_ATTACHMENT0,  
      gl.TEXTURE_2D,         
      unusedTexture,        
      0);   
 
function drawUniverse(projectionMatrix,cameraMatrix,textureMatrix,lightWorldMatrix,programInfo) {

  const viewMatrix = m4.inverse(cameraMatrix);
  gl.useProgram(programInfo.program);

  webglUtils.setUniforms(programInfo, {
    u_view: viewMatrix,
    u_projection: projectionMatrix,
    u_bias: settings.bias,
    u_textureMatrix: textureMatrix,
    u_projectedTexture: depthTexture,
    u_reverseLightDirection: lightWorldMatrix.slice(8, 11),
  });
  

  gl.uniform1f(gl.getUniformLocation(programInfo.program, "mesh"), 0.);

  // ------ Draw the ceiling -----
  webglUtils.setBuffersAndAttributes(gl, programInfo, planeBufferInfo);
  webglUtils.setUniforms(programInfo, ceilingUniforms);
  webglUtils.drawBufferInfo(gl, planeBufferInfo);


  // ------ Draw the first wall --------
  webglUtils.setBuffersAndAttributes(gl, programInfo, planeBufferInfo);
  webglUtils.setUniforms(programInfo, wallUniforms1);
  webglUtils.drawBufferInfo(gl, planeBufferInfo);


  // ------ Draw the second wall --------
  webglUtils.setBuffersAndAttributes(gl, programInfo, planeBufferInfo);
  webglUtils.setUniforms(programInfo, wallUniforms2);
  webglUtils.drawBufferInfo(gl, planeBufferInfo);


   // ------ Draw the third wall --------
  webglUtils.setBuffersAndAttributes(gl, programInfo, planeBufferInfo);
  webglUtils.setUniforms(programInfo, wallUniforms3);
  webglUtils.drawBufferInfo(gl, planeBufferInfo);

  // ------ Draw the four wall --------
  webglUtils.setBuffersAndAttributes(gl, programInfo, planeBufferInfo);
  webglUtils.setUniforms(programInfo, wallUniforms4);
  webglUtils.drawBufferInfo(gl, planeBufferInfo);
}



  function drawScene(projectionMatrix,cameraMatrix,textureMatrix,lightWorldMatrix,programInfo) {

    const viewMatrix = m4.inverse(cameraMatrix);
    gl.useProgram(programInfo.program);

    webglUtils.setUniforms(programInfo, {
      u_view: viewMatrix,
      u_projection: projectionMatrix,
      u_bias: settings.bias,
      u_textureMatrix: textureMatrix,
      u_projectedTexture: depthTexture,
      u_reverseLightDirection: lightWorldMatrix.slice(8, 11),
    });
    

    gl.uniform1f(gl.getUniformLocation(programInfo.program, "mesh"), 0.);


    // ------ Draw the floor --------  //Floor lo disegniamo qui perchè lo shader di riferimento è lo sceneProgramInfo per visualizzare le ombre sul piano
    webglUtils.setBuffersAndAttributes(gl, programInfo, planeBufferInfo);
    webglUtils.setUniforms(programInfo, floorUniforms);
    webglUtils.drawBufferInfo(gl, planeBufferInfo);


    // ---- Draw OBJS -----
    gl.uniform1f(gl.getUniformLocation(programInfo.program, "mesh"), 1.);
   
    // ---- Draw Truck ----
    webglUtils.setUniforms(programInfo, truckUniforms);
    for (const {bufferInfo, material} of parts) {
      webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);
      webglUtils.setUniforms(programInfo, material);
      webglUtils.drawBufferInfo(gl, bufferInfo);
    }

    // ----- Draw Fountain ----
    webglUtils.setUniforms(programInfo, fountainUniforms);
    for (const {bufferInfo, material} of parts_tv) {
      webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);
      webglUtils.setUniforms(programInfo, material);
      webglUtils.drawBufferInfo(gl, bufferInfo);
    }

    //Draw Building
        webglUtils.setUniforms(programInfo, buildingUniforms);
        for (const {bufferInfo, material} of parts_build) {
          webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);
          webglUtils.setUniforms(programInfo, material);
          webglUtils.drawBufferInfo(gl, bufferInfo);
        }

    //Draw Building 2
        webglUtils.setUniforms(programInfo, buildingUniforms1);
        for (const {bufferInfo, material} of parts_build1) {
            webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);
            webglUtils.setUniforms(programInfo, material);
            webglUtils.drawBufferInfo(gl, bufferInfo);
           }

    //Draw Building 3
        webglUtils.setUniforms(programInfo, buildingUniforms3);
        for (const {bufferInfo, material} of parts_build3) {
            webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);
            webglUtils.setUniforms(programInfo, material);
            webglUtils.drawBufferInfo(gl, bufferInfo);
           }
    //Draw Tree
        webglUtils.setUniforms(programInfo, treeUniforms);
        for (const {bufferInfo, material} of parts_tree) {
            webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);
            webglUtils.setUniforms(programInfo, material);
            webglUtils.drawBufferInfo(gl, bufferInfo);
           }

           
    // ---- Draw Dumpster ----
    webglUtils.setUniforms(programInfo, dumpsterUniforms);
    for (const {bufferInfo, material} of parts_dumpster) {
      webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);
      webglUtils.setUniforms(programInfo, material);
      webglUtils.drawBufferInfo(gl, bufferInfo);
    }
  }

///////////////////////////////////  GAME LOGIC  ///////////////////////////////////
/*

  function drawCollectArea() {
	
    if (!endGame) {
      const viewMatrix = m4.inverse(cameraMatrix);
      
      let objToDraw = getObjToDraw(objectsToDraw, "collectArea");
      const programInfo = objToDraw.programInfo;
      gl.useProgram(programInfo.program);
      
      let matrix = m4.identity();
      
      matrix = m4.translate(matrix, pxCollection, 0.1, pzCollection); //QUI
      matrix = m4.scale(matrix, 2, 2, 2);
      objToDraw.uniforms.u_world = matrix;
      
      webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw.bufferInfo);
      
      webglUtils.setUniforms(programInfo, objToDraw.uniforms);
      
      webglUtils.setUniforms(programInfo, {
        u_view: viewMatrix,
        u_projection: projectionMatrix,
        u_world: matrix,
      });
      
      if (insideArea) //cambia colore in verde
        webglUtils.setUniforms(programInfo, {
          u_color: [0,1,0,1],
        });
      
      webglUtils.drawBufferInfo(gl, objToDraw.bufferInfo);

      }


                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

  function render() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    const lightWorldMatrix = m4.lookAt(
        [settings.posX, settings.posY, settings.posZ],         
        [settings.targetX, settings.targetY, settings.targetZ], 
        [0, 1, 0],                                             
    );
    const lightProjectionMatrix = settings.spotLight
        ? m4.perspective(
            degToRad(settings.lightFieldOfView),
            settings.projWidth / settings.projHeight,
            1,  
            30)   
        : m4.orthographic(
            -settings.projWidth / 2,   
             settings.projWidth / 2,   
            -settings.projHeight / 2, 
             settings.projHeight / 2,  
             1,                      
             15);    

    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
    gl.viewport(0, 0, depthTextureSize, depthTextureSize);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const target = [0, 3, 0];
    const up = [0, 1, 0];
    
    var camera = [settings.D*Math.sin(PHI)*Math.cos(THETA), settings.D*Math.cos(PHI), settings.D*Math.sin(PHI)*Math.sin(THETA)];
    
    const cameraMatrix = m4.lookAt(camera, target, up) ;
    truckUniforms = {
      u_world : m4.scale(m4.zRotate(m4.xRotate(m4.translation(settings.dx, -0.05, settings.dz),-1.57),angle),settings.scaleX,settings.scaleY,settings.scaleZ),
    }

    dumpsterUniforms.u_world = m4.scale(m4.zRotate(m4.xRotate(m4.translation(pxTrash, pyTrash, pzTrash),0),0),2.5,2.5,2.5)

    if(settings.shadows){
      drawScene(lightProjectionMatrix,lightWorldMatrix,m4.identity(),lightWorldMatrix,colorProgramInfo);
    }
    
    
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    

    let textureMatrix = m4.identity();
    textureMatrix = m4.translate(textureMatrix, 0.5, 0.5, 0.5);
    textureMatrix = m4.scale(textureMatrix, 0.5, 0.5, 0.5);
    textureMatrix = m4.multiply(textureMatrix, lightProjectionMatrix);
    
    textureMatrix = m4.multiply(
        textureMatrix,
        m4.inverse(lightWorldMatrix));

   
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projectionMatrix =
        m4.perspective(fieldOfViewRadians, aspect, 1, 2000); 

    const viewMatrix = m4.inverse(cameraMatrix);
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    
    drawUniverse(viewProjectionMatrix,cameraMatrix,textureMatrix,lightWorldMatrix,universeProgramInfo);
    drawScene(viewProjectionMatrix,cameraMatrix,textureMatrix,lightWorldMatrix,sceneProgramInfo);
      
    if(settings.lightFrustum){
      const viewMatrix = m4.inverse(cameraMatrix);
      gl.useProgram(colorProgramInfo.program);

    
      webglUtils.setBuffersAndAttributes(gl, colorProgramInfo, cubeLinesBufferInfo);

      const mat = m4.multiply(
          lightWorldMatrix, m4.inverse(lightProjectionMatrix));
      webglUtils.setUniforms(colorProgramInfo, {
        u_color: [1, 1, 1, 1],
        u_view: viewMatrix,
        u_projection: projectionMatrix,
        u_world: mat,
      });
      webglUtils.drawBufferInfo(gl, cubeLinesBufferInfo, gl.LINES);
    }
    
  }
  render();
  
}
