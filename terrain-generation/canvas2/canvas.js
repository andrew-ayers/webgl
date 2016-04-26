var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

/* GRID SUB-DIVISION STRUCTURING
*
* v0                        v1
*   +----------------------+
*   |                    / |		Grid is defined where each cell is
*   |                  /   |        divided into two triangles:
*   |     1st        /     |        
*   |              /       |         
*   |            /         |        	1st = Upper
*   +          /	       |        	2nd = Lower
*   |        /             |            
*   |      /       2nd     |        
*   |    /                 |        The triangles are generated 
*   |  /                   |        point-to-point in clock-wise order,
*   |/                     |        starting at the 90-degree vertices,
*   +----------------------+	    v0 and v3. 
* v2                        v3      
*
*/

var initgrid = function(width, height) {
	var grid = {};
	
	grid.width = width;
	grid.height = height;
	
	grid.elevations = [];
	
	var size = width * height, i = 0;
	
	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			grid.elevations[i] = {x: x, y: y, z: 0};
			i++;
		}
	}
	
	return grid;
}

var frakgrid = function(grid, iterations) {
	for (var i=0; i < iterations; i++) {
		var frakdir = Math.random();
		
		if (frakdir > 0.2) {
			grid = fracline(grid, Math.floor(Math.random() * grid.width), 0, Math.floor(Math.random() * grid.width), grid.height - 1);
		}
		else {
			grid = fracline(grid, 0, Math.floor(Math.random() * grid.height), grid.width - 1, Math.floor(Math.random() * grid.height));
		}
	}
	
	return grid;
}

var fracline = function(grid, x0, y0, x1, y1) {
   var dx = Math.abs(x1 - x0);
   var dy = Math.abs(y1 - y0);
   var sx = (x0 < x1) ? 1 : -1;
   var sy = (y0 < y1) ? 1 : -1;
   var err = dx - dy;

   while(true){
	 var pos = y0 * grid.height + x0;
	 
	 //grid.elevations[pos].z = grid.elevations[pos].z + Math.floor(Math.random() * 5) - 1;
	 grid.elevations[pos].z = Math.sin(grid.elevations[pos].x) + Math.cos(grid.elevations[pos].y) + Math.floor(Math.random() * 5) - 1;

	 if (grid.elevations[pos].z < 0) grid.elevations[pos].z = 0;
	 
     if ((x0 == x1) && (y0 == y1)) break;
     
     var e2 = 2 * err;
     
     if (e2 >-dy){ err -= dy; x0  += sx; }
     if (e2 < dx){ err += dx; y0  += sy; }
   }
   
   return grid;
}

var rendergrid = function(grid, scale) {
	for (var y = 0; y < grid.height - 1; y++) {
		for (var x = 0; x < grid.width - 1; x++) {
			// draw triangle 1
			context.beginPath();
			context.moveTo(x * scale, y * scale);
			context.lineTo((x + 1) * scale, y * scale);
			context.lineTo(x * scale, (y + 1) * scale);
			context.lineTo(x * scale, y * scale);
			
			var height = (grid.elevations[y * grid.width + x].z + 
			             grid.elevations[y * grid.width + (x + 1)].z +
			             grid.elevations[(y + 1) * grid.width + x].z) / 3;
			
			context.strokeStyle = '#00ff00';
			context.fillStyle = '#00aa00';
			
			if (height <= 0) {
				height = 0;
				context.strokeStyle = '#0000ff';
				context.fillStyle = '#0000ff';
			}
					
			context.fill();
			
			// draw triangle 2
			context.beginPath();
			context.moveTo((x + 1) * scale, y * scale);
			context.lineTo((x + 1) * scale, (y + 1) * scale);
			context.lineTo(x * scale, (y + 1) * scale);
			context.lineTo((x + 1) * scale, y * scale);
			
			var height = (grid.elevations[y * grid.width + (x + 1)].z + 
			             grid.elevations[(y + 1) * grid.width + (x + 1)].z +
			             grid.elevations[(y + 1) * grid.width + x].z) / 3;
			
			context.strokeStyle = '#00ff00';
			context.fillStyle = '#00aa00';
			
			if (height <= 0) {
				height = 0;
				context.strokeStyle = '#0000ff';
				context.fillStyle = '#0000ff';
			}
					
			context.fill();
			
			context.stroke();			
		}
	}
}

var scene;
var camera;
var renderer;
var mesh;

// revolutions per second
var angularSpeed = 0.02; 
var lastTime = 0;

// this function is executed on each animation frame
var animate3JS = function(){
	// update
	var time = (new Date()).getTime();
	var timeDiff = time - lastTime;
	var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
	mesh.rotation.y += angleChange;
	lastTime = time;

	// render
	renderer.render(scene, camera);

	// request new frame
	requestAnimationFrame(function(){
		animate3JS();
	});
}	  

var rendergrid3JS = function(grid, scale) {
	scene = new THREE.Scene();

	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 55, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,200,600);
	camera.lookAt(scene.position);	

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	// SHADOWS
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;

	renderer.shadowCameraNear = 3;
	renderer.shadowCameraFar = camera.far;
	renderer.shadowCameraFov = 50;

	renderer.shadowMapBias = 0.0039;
	renderer.shadowMapDarkness = 0.5;
	renderer.shadowMapWidth = 1024;
	renderer.shadowMapHeight = 1024;	
	
	document.body.appendChild(renderer.domElement);

	var geom = new THREE.Geometry();

	for (var y = 0; y < grid.height - 1; y++) {
		for (var x = 0; x < grid.width - 1; x++) {
			// triangle 1
			geom.vertices.push(
				new THREE.Vector3(
					grid.elevations[y * grid.width + (x + 1)].x * scale, 
					grid.elevations[y * grid.width + (x + 1)].z * scale,
					grid.elevations[y * grid.width + (x + 1)].y * scale
				)
			);

			geom.vertices.push(
				new THREE.Vector3(
					grid.elevations[y * grid.width + x].x * scale, 
					grid.elevations[y * grid.width + x].z * scale,
					grid.elevations[y * grid.width + x].y * scale
				)
			);

			geom.vertices.push(
				new THREE.Vector3(
					grid.elevations[(y + 1) * grid.width + x].x * scale, 
					grid.elevations[(y + 1) * grid.width + x].z * scale,
					grid.elevations[(y + 1) * grid.width + x].y * scale
				)
			);

			// triangle 2
			geom.vertices.push(
				new THREE.Vector3(
					grid.elevations[(y + 1) * grid.width + (x + 1)].x * scale, 
					grid.elevations[(y + 1) * grid.width + (x + 1)].z * scale,
					grid.elevations[(y + 1) * grid.width + (x + 1)].y * scale
				)
			);

			geom.vertices.push(
				new THREE.Vector3(
					grid.elevations[y * grid.width + (x + 1)].x * scale, 
					grid.elevations[y * grid.width + (x + 1)].z * scale,
					grid.elevations[y * grid.width + (x + 1)].y * scale
				)
			);


			geom.vertices.push(
				new THREE.Vector3(
					grid.elevations[(y + 1) * grid.width + x].x * scale, 
					grid.elevations[(y + 1) * grid.width + x].z * scale,
					grid.elevations[(y + 1) * grid.width + x].y * scale
				)
			);			
		}
	}

	var count = 3;

	for (var y = 0; y < grid.height - 1; y++) {
		for (var x = 0; x < grid.width - 1; x++) {
			var height = (grid.elevations[y * grid.width + (x + 1)].z +
						  grid.elevations[y * grid.width + x].z +
						  grid.elevations[(y + 1) * grid.width + x].z) / 3;

			var fcolor = 0x111111;
			
			if (height <= 0) fcolor = 0x553300;

			var normal = new THREE.Vector3(0, 1, 0);
			var color = new THREE.Color(fcolor);
			var face = new THREE.Face3(count - 1, count - 2, count - 3, normal, color, 0);

			geom.faces.push(face);
			
			count += 3;                      
			
			var height = (grid.elevations[(y + 1) * grid.width + (x + 1)].z +
						  grid.elevations[y * grid.width + (x + 1)].z +
						  grid.elevations[(y + 1) * grid.width + x].z) / 3;

			var fcolor = 0x111111;
			
			if (height <= 0) fcolor = 0x553300;

			var normal = new THREE.Vector3(0, 1, 0);
			var color = new THREE.Color(fcolor);
			var face = new THREE.Face3(count - 1, count - 2, count - 3, normal, color, 0);

			geom.faces.push(face);
			
			count += 3;                      
		}
	}

	geom.computeFaceNormals();

	geom.applyMatrix( 
		new THREE.Matrix4().makeTranslation(
			-((grid.width * scale) / 2), 
			0, 
			-((grid.height * scale)/ 2)
		)
	);

	var attrs = {vertexColors: THREE.FaceColors, side: THREE.DoubleSide}
	//var material = new THREE.MeshBasicMaterial(attrs);
	//var material = new THREE.MeshLambertMaterial(attrs);
	var material = new THREE.MeshPhongMaterial(attrs);
	mesh = new THREE.Mesh(geom, material);

	THREE.GeometryUtils.merge(geom, mesh);

	scene.add(mesh);

	// LIGHT
	//var light = new THREE.PointLight(0xffffff);
	var light = new THREE.PointLight(0xffffff);
	light.position.set(400,250,0);
	scene.add(light);

	light = new THREE.DirectionalLight(0xffffff);
	light.position.set(2, 2, 2);
	light.target.position.set(0, 0, 0);
	light.castShadow = true;
	light.shadowDarkness = 0.75;
	scene.add(light);

	// SKYBOX/FOG
	var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
	var skyBoxMaterial = new THREE.MeshBasicMaterial({color: 0x00ffff, side: THREE.BackSide});
	var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
	scene.add(skyBox);
	//scene.fog = new THREE.FogExp2(0x000000, 0.0015);

	animate3JS();	  		  
}

//////////////////////////////////////////////////////////////////////////

// set size of base grid and number of frakking iterations to run
var size = 200;
var iterations = 50;

// frak the grid
var grid = frakgrid(initgrid(size, size), iterations);

// render the 2D grid
rendergrid(grid, 4);

// render the 3D grid
rendergrid3JS(grid, 20);

console.log(grid);
