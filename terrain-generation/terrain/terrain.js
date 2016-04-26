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

var initgrid = function(size) {
	var grid = {};
	
	grid.size = size;
	grid.width = size;
	grid.height = size;
	
	grid.elevations = [];
	
	for (var i = 0; i < size * size; i++) {
		grid.elevations[i] = 0;
	}
	
	grid.elevations[0] = Math.floor(Math.random() * 256);

	grid.elevations[size - 1] = Math.floor(Math.random() * 256);

	grid.elevations[(size - 1) * size] = Math.floor(Math.random() * 256);

	grid.elevations[(size - 1) * size + (size - 1)] = Math.floor(Math.random() * 256);
	
	/*
	var midx = Math.floor(size / 2);
	var midy = Math.floor(size / 2);

    var posm = (midy * size + midx);
    
	grid.elevations[posm] = 255;
	*/
	
	return grid;
}

var fracgrid = function(grid, iteration, x0, y0, x1, y1) {
	if (iteration == undefined) iteration = grid.size;
	if (x0 == undefined) x0 = 0;
	if (y0 == undefined) y0 = 0;
	if (x1 == undefined) x1 = grid.width; //- 1;
	if (y1 == undefined) y1 = grid.height;// - 1;

	var pos0 = (y0 * (grid.width) + x0);
	var pos1 = (y0 * (grid.width) + x1 - 1);
	var pos2 = ((y1 - 1) * (grid.width) + x0);
	var pos3 = ((y1 - 1) * (grid.width) + (x1 - 1));

	var midx = Math.floor((x1 - x0) / 2);
	var midy = Math.floor((y1 - y0) / 2);

    var posxm = (y0 * grid.width + (x0 + midx));
    var posym = ((y0 + midy) * grid.width + x0);
    var poszm = ((y0 + midy) * grid.width + (x0 + midx));
    
    //console.log(x0, y0, x1, y1, midx, midy);
    //console.log(pos0, pos1, pos2, pos3);
	//console.log(grid.elevations[pos0], grid.elevations[pos1], grid.elevations[pos2], grid.elevations[pos3]);

	//console.log(pos0, grid.elevations[pos0], pos1, grid.elevations[pos1], pos2, grid.elevations[pos2], pos3, grid.elevations[pos3]);//, posm);

	var pavg0 = Math.floor((grid.elevations[pos1] + grid.elevations[pos2] + grid.elevations[pos3]) / 3);	
	var pavgx = Math.floor((grid.elevations[pos0] + grid.elevations[pos1]) / 2);
	var pavgy = Math.floor((grid.elevations[pos0] + grid.elevations[pos2]) / 2);
    var pavgz = Math.floor((grid.elevations[pos0] + grid.elevations[pos1] + grid.elevations[pos2] + grid.elevations[pos3]) / 4);

	var roughness = iteration * 0.95;
	
	var change = Math.floor((Math.random() * roughness) - (roughness / 2));
	
	//console.log(pavg);//, roughness, change);
	
    //grid.elevations[posm] = 128;//
    //grid.elevations[posm] = pavg;
    //grid.elevations[posm] += pavg + Math.floor((Math.random() * roughness) - (roughness / 2));
    //grid.elevations[posm] += pavg + change;
    //grid.elevations[pos0] += pavg0 + (Math.floor(Math.random() * 3) - 1);
    //grid.elevations[posxm] += pavgx + (Math.floor(Math.random() * 3) - 1);
    //grid.elevations[posym] += pavgy + (Math.floor(Math.random() * 3) - 1);
    grid.elevations[poszm] += pavgz + (Math.floor(Math.random() * 3) - 1);
    //grid.elevations[posm] += Math.floor(pavg + (Math.random() * roughness));

	if (grid.elevations[pos0] < 0) grid.elevations[pos0] = 0;
	if (grid.elevations[pos0] > 255) grid.elevations[pos0] = 255;

	if (grid.elevations[posxm] < 0) grid.elevations[posxm] = 0;
	if (grid.elevations[posxm] > 255) grid.elevations[posxm] = 255;

	if (grid.elevations[posym] < 0) grid.elevations[posym] = 0;
	if (grid.elevations[posym] > 255) grid.elevations[posym] = 255;

	if (grid.elevations[poszm] < 0) grid.elevations[poszm] = 0;
	if (grid.elevations[poszm] > 255) grid.elevations[poszm] = 255;
	
	//console.log(iteration);
	//iteration = iteration / .93;

	if (midx <= 0 && midy <= 0) return grid;

	grid = fracgrid(grid, iteration, x0, y0, x0 + midx, y0 + midy);
	grid = fracgrid(grid, iteration, x0 + midx, y0, x1, y0 + midy);
	grid = fracgrid(grid, iteration, x0, y0 + midy, x0 + midx, y1);
	grid = fracgrid(grid, iteration, x0 + midx, y0 + midy, x1, y1);

	return grid;
}

var rendergrid = function(grid, scale) {
	for (var y = 0; y < grid.height; y++) {
		for (var x = 0; x < grid.width; x++) {
			// draw triangle 1
			context.beginPath();
			context.moveTo(x * scale, y * scale);
			context.lineTo((x + 1) * scale, y * scale);
			context.lineTo(x * scale, (y + 1) * scale);
			context.lineTo(x * scale, y * scale);
			
			var height = grid.elevations[y * grid.width + x];
			/*
			var height = (grid.elevations[y * grid.width + x] + 
			             grid.elevations[y * grid.width + (x + 1)] +
			             grid.elevations[(y + 1) * grid.width + x]) / 3;
			*/
			var color = '#' + rgb2hex(height, height, height);
			
			context.strokeStyle = color;//'#00ff00';
			context.fillStyle = color;//'#00aa00';
			
			/*
			if (height <= 0) {
				context.strokeStyle = '#00aaff';
				context.fillStyle = '#0000ff';
			}
			*/
					
		    context.fill();
			context.stroke();			
			
			// draw triangle 2
			context.beginPath();
			context.moveTo((x + 1) * scale, y * scale);
			context.lineTo((x + 1) * scale, (y + 1) * scale);
			context.lineTo(x * scale, (y + 1) * scale);
			context.lineTo((x + 1) * scale, y * scale);
			
			//var height = grid.elevations[y * grid.width + x];
			/*
			var height = (grid.elevations[y * grid.width + (x + 1)] + 
			             grid.elevations[(y + 1) * grid.width + (x + 1)] +
			             grid.elevations[(y + 1) * grid.width + x]) / 3;
			*/
			context.strokeStyle = color;//'#00ff00';
			context.fillStyle = color;//'#00aa00';
			
			/*
			if (height <= 0) {
				context.strokeStyle = '#00aaff';
				context.fillStyle = '#0000ff';
			}
			*/
					
			context.fill();
			context.stroke();			
		}
	}
}

var rgb2hex = function(red, green, blue) {
	red = Math.floor(red);
	green = Math.floor(green);
	blue = Math.floor(blue);
	
    var decColor = 0x1000000 + blue + 0x100 * green + 0x10000 * red;
    
    return decColor.toString(16).substr(1);
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
					(x + 1) * scale, 
					grid.elevations[y * grid.width + (x + 1)] * scale,
					y * scale
				)
			);

			geom.vertices.push(
				new THREE.Vector3(
					x * scale, 
					grid.elevations[y * grid.width + x] * scale,
					y * scale
				)
			);

			geom.vertices.push(
				new THREE.Vector3(
					x * scale, 
					grid.elevations[(y + 1) * grid.width + x] * scale,
					(y + 1) * scale
				)
			);

			// triangle 2
			geom.vertices.push(
				new THREE.Vector3(
					(x + 1) * scale, 
					grid.elevations[(y + 1) * grid.width + (x + 1)] * scale,
					(y + 1) * scale
				)
			);

			geom.vertices.push(
				new THREE.Vector3(
					(x + 1) * scale, 
					grid.elevations[y * grid.width + (x + 1)] * scale,
					y * scale
				)
			);


			geom.vertices.push(
				new THREE.Vector3(
					x * scale, 
					grid.elevations[(y + 1) * grid.width + x] * scale,
					(y + 1) * scale
				)
			);			
		}
	}

	var count = 3;

	for (var y = 0; y < grid.height - 1; y++) {
		for (var x = 0; x < grid.width - 1; x++) {
			var height = (grid.elevations[y * grid.width + (x + 1)] +
						  grid.elevations[y * grid.width + x] +
						  grid.elevations[(y + 1) * grid.width + x]) / 3;

			var fcolor = 0x111111;
			
			if (height <= 0) fcolor = 0x553300;

			var normal = new THREE.Vector3(0, 1, 0);
			var color = new THREE.Color(fcolor);
			var face = new THREE.Face3(count - 1, count - 2, count - 3, normal, color, 0);

			geom.faces.push(face);
			
			count += 3;                      
			
			var height = (grid.elevations[(y + 1) * grid.width + (x + 1)] +
						  grid.elevations[y * grid.width + (x + 1)] +
						  grid.elevations[(y + 1) * grid.width + x]) / 3;

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
			-((grid.height * scale) / 2)
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
	var light = new THREE.PointLight(0xffffff);
	light.position.set(400, 250, 0);
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
	scene.fog = new THREE.FogExp2(0xffff00, 0.0025);

	animate3JS();	  		  
}

//////////////////////////////////////////////////////////////////////////

// set size of base grid and number of frakking iterations to run
var size = 128;

// frac the grid
var grid = fracgrid(initgrid(size));
//var grid = initgrid(size);
// render the 2D grid
rendergrid(grid, 8);

// render the 3D grid
rendergrid3JS(grid, 8);

console.log(grid);
