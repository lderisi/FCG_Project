// TRUCK MODEL

function defaultMaterial(){
    return {
        diffuse: [1, 1, 1],
        diffuseMap: textures.defaultWhite,
        ambient: [0, 0, 0],
        specular: [1, 1, 1],
        shininess: 400,
        opacity: 1,
      };
}

async function load_obj(gl,objHref,use_MTL=true){
    const response = await fetch(objHref);
    const text = await response.text();
    const obj = parseOBJ(text);
    const baseHref = new URL(objHref, window.location.href);
    const matTexts = await Promise.all(obj.materialLibs.map(async filename => {
      const matHref = new URL(filename, baseHref).href;
      const response = await fetch(matHref);
      return await response.text();
    }));
    const materials = parseMTL(matTexts.join('\n'));
    
    const textures = {
      defaultWhite: create1PixelTexture(gl, [255, 255, 255, 255]),
    };
    if(use_MTL){
        for (const material of Object.values(materials)) {
        Object.entries(material)
            .filter(([key]) => key.endsWith('Map'))
            .forEach(([key, filename]) => {
            let texture = textures[filename];
            if (!texture) {
                const textureHref = new URL(filename, baseHref).href;
                texture = createTexture(gl, textureHref);
                textures[filename] = texture;
            }
            material[key] = texture;
            });
        }
    }
    
    
    const parts = obj.geometries.map(({material, data}) => {
      if (data.color) {
        if (data.position.length === data.color.length) {
          data.color = { numComponents: 3, data: data.color };
        }
      } else {
        data.color = { value: [1, 1, 1, 1] };
      }
      const bufferInfo = webglUtils.createBufferInfoFromArrays(gl, data);
      return {
        material: {
          ...defaultMaterial,
          ...materials[material],
        },
        bufferInfo,
      };
    }); 
    console.log(parts)
    return parts;

}


