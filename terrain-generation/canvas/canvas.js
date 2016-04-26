var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

/* TRIANGLE SUB-DIVISION STRUCTURING
*
* v0                         v1
*   +----------------------+
*   |\                   /
*   |  \      2nd      /            Triangle is sub-divided in 	   
*   |    \           /              the following order:
*   |      \       /                
*   |        \   /                  1st = Lower
*   +  1st     /	                   2nd = Upper
*   |        /                     
*   |      /                       
*   |    /
*   |  /                            Sub-divided triangles are
*   |/                              generated point-to-point in
*   +	                           clock-wise order, starting at
* v2                                the 90-degree vertex (v0)
*
*/

// subdivide a triangale for a number of iterations
var subdivide = function(tri, iterations) {
	var triangles = {};

	// initialize/increment sub-division counter
	if (tri.count == undefined) {
	  tri.count = iterations;
	}
	else {
	  tri.count--;
	}

	// NOTE: Render code can be put here for generational rendering

	if (tri.count > 0) {
		// find hypotenuse of current triangle...
		var d0 = distance(tri.v0.beg.x, tri.v0.beg.y, tri.v0.end.x, tri.v0.end.y);
		var d1 = distance(tri.v1.beg.x, tri.v1.beg.y, tri.v1.end.x, tri.v1.end.y);
		var d2 = distance(tri.v2.beg.x, tri.v2.beg.y, tri.v2.end.x, tri.v2.end.y);

		// ...then find the mid-point of it and opposite vertex
		var mhx = opx = 0;
		var mhy = opy = 0;
		var mhz = opz = 0;
		
		if (d0 > d1 && d0 > d2) {
			mhx = (tri.v0.beg.x + tri.v0.end.x) / 2;
			mhy = (tri.v0.beg.y + tri.v0.end.y) / 2;
			mhz = (tri.v0.beg.z + tri.v0.end.z) / 2;

			opx = tri.v2.end.x;
			opy = tri.v2.end.y;
			opz = tri.v2.end.z;
		}
		else if (d1 > d0 && d1 > d2) {
			mhx = (tri.v1.beg.x + tri.v1.end.x) / 2;
			mhy = (tri.v1.beg.y + tri.v1.end.y) / 2;
			mhz = (tri.v1.beg.z + tri.v1.end.z) / 2;

			opx = tri.v0.beg.x;
			opy = tri.v0.beg.y;			
			opz = tri.v0.beg.z;			
		}
		else if (d2 > d0 && d2 > d1) {
			mhx = (tri.v2.beg.x + tri.v2.end.x) / 2;
			mhy = (tri.v2.beg.y + tri.v2.end.y) / 2;
			mhz = (tri.v2.beg.z + tri.v2.end.z) / 2;

			opx = tri.v1.beg.x;
			opy = tri.v1.beg.y;						
			opz = tri.v1.beg.z;			
		}
		
		var water = Math.floor(Math.random() * 9) * -1
		var vz0 = Math.floor(Math.random() * 20) - 3;
		var vz1 = Math.floor(Math.random() * 20) - 3;
		var vz2 = Math.floor(Math.random() * 20) - 3;
		var vz3 = Math.floor(Math.random() * 20) - 3;
		
		// define vectors for new half-triangle #1
		vector0 = {
			beg: {
				x: mhx,
				y: mhy,
				z: mhz + vz0 + water
			},
			
			end: {
				x: tri.v1.end.x,
				y: tri.v1.end.y,
				z: tri.v1.end.z //+ vz1 + water
			}
		 };
		 
		vector1 = {
			beg: {
				x: tri.v1.end.x,
				y: tri.v1.end.y,
				z: tri.v1.end.z //+ vz1 + water
			},
			
			end: {
				x: opx,
				y: opy,
				z: opz //+ vz2 + water
			}
		 };

		vector2 = {
			beg: {
				x: opx,
				y: opy,
				z: opz //+ vz2 + water
			},
			
			end: {
				x: mhx,
				y: mhy,
				z: mhz + vz0 + water
			}
		 };
		 
		 // define new half-triangle #1
		 var triangle0 = {v0:vector0, v1:vector1, v2:vector2, count: tri.count};		 


		// define vectors for new half-triangle #2
		vector0 = {
			beg: {
				x: mhx,
				y: mhy,
				z: mhz + vz0 + water
			},
			
			end: {
				x: opx,
				y: opy,
				z: opz// + vz2 + water
			}
		 };
		 
		vector1 = {
			beg: {					
				x: opx,
				y: opy,
				z: opz// + vz2 + water
			},
			
			end: {
				x: tri.v0.end.x,
				y: tri.v0.end.y,
				z: tri.v0.end.z //+ vz3 + water
			}
		 };

		vector2 = {
			beg: {
				x: tri.v0.end.x,
				y: tri.v0.end.y,
				z: tri.v0.end.z //+ vz3 + water
			},
			
			end: {
				x: mhx,
				y: mhy,
				z: mhz + vz0 + water
			}
		 };
		 
		 // define new half-triangle #2
		 var triangle1 = {v0:vector0, v1:vector1, v2:vector2, count: tri.count};		 

		 // if done sub-dividing, return last set of triangles...
		 if (tri.count <= 0) {
			triangles = {
			  t0: triangle0,
			  t1: triangle1
			}
		 }
		 // ...otherwise sub-divide those triangles
		 else {
			triangles = {
			  t0: subdivide(triangle0, tri.count),
			  t1: subdivide(triangle1, tri.count)
			}
		 }
	 }
	 else {
		 // max iterations reached - no more sub-dividing possible, 
		 // return final triangle
		 triangles.count = tri.count;
		 triangles.v0 = tri.v0;
		 triangles.v1 = tri.v1;
		 triangles.v2 = tri.v2;
	 }
	 
	 return triangles;
}   		

// return the distance between two points
var distance = function(x0, y0, x1, y1) {
  return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
}

// reduce hierarchical object to an array of triangle objects
var reduce = function(triangles, list) {
  if (list == undefined) {
	  list = [];
  }
  
  for (var prop in triangles) {
	if (prop.substr(0, 1) == "t") {
		list = reduce(triangles[prop], list); 
	}
	else if (prop == "count") {
		list = list.concat({v0: triangles.v0, v1: triangles.v1, v2: triangles.v2});
	}
  }				

  return list;
}

/*
var grow = function(triangles, iterations) {
  for (var i=0; i < iterations; i++) {
	  
	for (var prop in triangles) { 
		// alter triangle
		var tri = triangles[prop];

	//var v1 = new THREE.Vector3(tri.v0.beg.x-100, tri.v0.beg.z-100, tri.v0.beg.y-600);
	//var v2 = new THREE.Vector3(tri.v1.beg.x-100, tri.v1.beg.z-100, tri.v1.beg.y-600);
	//var v3 = new THREE.Vector3(tri.v2.beg.x-100, tri.v2.beg.z-100, tri.v2.beg.y-600);

	geom.vertices.push(new THREE.Vector3(tri.v0.beg.x-400, tri.v0.beg.z-100, tri.v0.beg.y-400));
	geom.vertices.push(new THREE.Vector3(tri.v1.beg.x-400, tri.v1.beg.z-100, tri.v1.beg.y-400));
	geom.vertices.push(new THREE.Vector3(tri.v2.beg.x-400, tri.v2.beg.z-100, tri.v2.beg.y-400));
}
	  
  }
}
*/

var render = function(triangles) {
	for (var prop in triangles) { 
		// draw triangle
		var tri = triangles[prop];

		context.beginPath();
		context.moveTo(tri.v0.beg.x, tri.v0.beg.y);
		context.lineTo(tri.v0.end.x, tri.v0.end.y);
		context.lineTo(tri.v1.end.x, tri.v1.end.y);
		context.lineTo(tri.v2.end.x, tri.v2.end.y);
		
		var height = (tri.v0.beg.z + tri.v0.end.z + tri.v1.end.z) / 3;

		context.strokeStyle = '#00ff00';
		context.fillStyle = '#00aa00';
		
		if (height <= 0) {
			height = 0;
			context.strokeStyle = '#0000ff';
			context.fillStyle = '#0000aa';
		}
				
		context.fill();
		context.stroke();
	}		  
}

var scene;
var camera;
var renderer;
var mesh;

// revolutions per second
var angularSpeed = 0.2; 
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


var render3JS = function(triangles) {
	scene = new THREE.Scene();

	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,150,400);
	camera.lookAt(scene.position);	

	/*
	var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 400;
	scene.add(camera);
	*/

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	var geom = new THREE.Geometry();


	for (var prop in triangles) { 
		// draw triangle
		var tri = triangles[prop];

		//var v1 = new THREE.Vector3(tri.v0.beg.x-100, tri.v0.beg.z-100, tri.v0.beg.y-600);
		//var v2 = new THREE.Vector3(tri.v1.beg.x-100, tri.v1.beg.z-100, tri.v1.beg.y-600);
		//var v3 = new THREE.Vector3(tri.v2.beg.x-100, tri.v2.beg.z-100, tri.v2.beg.y-600);

		geom.vertices.push(new THREE.Vector3(tri.v0.beg.x-400, tri.v0.beg.z-100, tri.v0.beg.y-400));
		geom.vertices.push(new THREE.Vector3(tri.v1.beg.x-400, tri.v1.beg.z-100, tri.v1.beg.y-400));
		geom.vertices.push(new THREE.Vector3(tri.v2.beg.x-400, tri.v2.beg.z-100, tri.v2.beg.y-400));
	}

	var count = 3;

	for (var prop in triangles) { 
		// draw triangle
		var tri = triangles[prop];

		var height = (tri.v0.beg.z + tri.v1.beg.z + tri.v2.beg.z) / 3;

		var fcolor = 0x00ff00;
		
		height = (Math.random() * 5) - 2;
		if (height <= 0) {
			height = 0;
			fcolor = 0x0000ff;
		}

		var normal = new THREE.Vector3(0, 1, 0);
		var color = new THREE.Color(fcolor);
		var face = new THREE.Face3(count - 1, count - 2, count - 3, normal, color, 0);

		geom.faces.push(face);
		
		count += 3;                      
	}

	geom.computeFaceNormals();

	var attrs = {vertexColors: THREE.FaceColors, side: THREE.DoubleSide}
	var material = new THREE.MeshBasicMaterial(attrs);
	mesh = new THREE.Mesh(geom, material);

	THREE.GeometryUtils.merge(geom, mesh);

	scene.add(mesh);

	// LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);

	// SKYBOX/FOG
	var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
	var skyBoxMaterial = new THREE.MeshBasicMaterial({color: 0x9999ff, side: THREE.BackSide});
	var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
	scene.add(skyBox);
	scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);

	//renderer.render(scene, camera);	

	animate3JS();	  		  
}

// generate a base triangle
var base_triangle = function(size) {
  var vector0 = {beg:{x: 0, y: 0, z: 90}, end:{x: size, y: 0, z: 50}};
  var vector1 = {beg:{x: size, y: 0, z: 50}, end:{x: 0, y: size, z: 0}};
  var vector2 = {beg:{x: 0, y: size, z: 0}, end:{x: 0, y: 0, z: 0}};
  
  return {v0:vector0, v1:vector1, v2:vector2};
}

//////////////////////////////////////////////////////////////////////////

// set size of base triangle and number of iterations to run
var size = 800;
var iterations = 14;

// define initial base triangle and sub-divide it!
var triangles = reduce(subdivide(base_triangle(size), iterations));

//render(triangles);
render3JS(triangles);

console.log(triangles);
