$.when(
    // ================================
    // ======== SCRIPTS 
    // ================================

    // === init
    $.getScript( "/js/vendor/three-js/build/three.min.js" ),
    $.getScript( "/js/vendor/three-js/examples/js/libs/stats.min.js" ),
    $.getScript( "/js/vendor/three-js/examples/js/Detector.js" ),

    // === controls
    // $.getScript( "/js/vendor/three-js/examples/js/controls/TrackballControls.js" ),

    // === loaders
    $.getScript( "/js/max/3d_world/3d_world_controls.js" ),
    $.getScript( "/js/vendor/three-js/examples/js/loaders/MTLLoader.js" ),
    $.getScript( "/js/vendor/three-js/examples/js/loaders/OBJLoader.js" ),
    $.getScript( "/js/vendor/three-js/examples/js/loaders/OBJMTLLoader.js" ),
    // $.getScript( "/js/vendor/three-js/examples/js/loaders/PDBLoader.js" ),

    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })

).done(function(){

	// ================================
    // ======== SCRIPTS LOADED - START
    // ================================

	var camera, scene, renderer;
	var geometry, material, mesh;
	var controls;

	var objects = [];

	var ray;

	var blocker = document.getElementById( 'blocker' );
	var instructions = document.getElementById( 'instructions' );
	var pause = true;

	// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
	
	init();
	animate();
	setInterval(variableCheck, 500);

	function init() {

		camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0x000000, 0, 750 );

		var light = new THREE.DirectionalLight( 0x00ffff, 1.5 );
		light.position.set( 1, 1, 1 );
		scene.add( light );

		var light = new THREE.DirectionalLight( 0x00ffff, 0.75 );
		light.position.set( -1, - 0.5, -1 );
		scene.add( light );

		controls = new THREE.PointerLockControls( camera );
		scene.add( controls.getObject() );

		ray = new THREE.Raycaster();
		ray.ray.direction.set( 0, -1, 0 );

		// floor

		geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

		for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
			var vertex = geometry.vertices[ i ];
		}

		//floor material

		for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {
			var face = geometry.faces[ i ];
		}

		//floor material
		material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true  } );

		mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );

		// objects

		// === OBJ MODELS - START

		var loader = new THREE.OBJMTLLoader();
		loader.load( '../../../models/obj/Armchair/Armchair.obj', '../../../models/obj/Armchair/Armchair.mtl', function ( object ) {

			object.position.y = 0;
			object.position.x = 0;
			object.position.z = -400;
			object.rotation.y = 500;
			scene.add( object );

		} );

		var loader = new THREE.OBJMTLLoader();
		loader.load( '../../../models/obj/boat/boat.obj', '../../../models/obj/boat/boat.mtl', function ( object ) {

			object.position.y = 40;
			object.position.x = 0;
			object.position.z = 0;
			object.rotation.y = 500;
			scene.add( object );

		} );
		// === OBJ MODELS - END

		// === BLOCKS - START

		geometry = new THREE.BoxGeometry( 20, 20, 20 );

		for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

			var face = geometry.faces[ i ];
			face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

		}

		for ( var i = 0; i < 1000; i ++ ) {

			material = new THREE.MeshPhongMaterial( { specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

			var mesh = new THREE.Mesh( geometry, material );
			mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
			mesh.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
			mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
			//scene.add( mesh );

			material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

			//objects.push( mesh );

		}

		// === BLOCKS - END

		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor( 0x000000 );
		renderer.setSize( window.innerWidth, window.innerHeight );

		document.body.appendChild( renderer.domElement );

		window.addEventListener( 'resize', onWindowResize, false );

	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function animate() {

		requestAnimationFrame( animate );

		controls.isOnObject( false );

		ray.ray.origin.copy( controls.getObject().position );
		ray.ray.origin.y -= 10;

		var intersections = ray.intersectObjects( objects );

		if ( intersections.length > 0 ) {

			var distance = intersections[ 0 ].distance;

			if ( distance > 0 && distance < 10 ) {

				controls.isOnObject( true );

			}

		}

		controls.update();

		renderer.render( scene, camera );

	}

	function variableCheck () {
		if(!pause){
			$('.debug').html('');
			$('.debug').append("<p>"+pause+" : pause</p>");
			$('.debug').append("<p> "+ray.ray.origin.x+" : x</p>");
			$('.debug').append("<p> "+ray.ray.origin.y+" : y</p>");
			$('.debug').append("<p> "+ray.ray.origin.z+" : z</p>");
			console.log(controls);
		}
	}

	// ============================
	// === POINTER LOCKER START ===
	// ============================

	var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

	if ( havePointerLock ) {

		var element = document.body;

		var pointerlockchange = function ( event ) {

			if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

				controls.enabled = true;

				blocker.style.display = 'none';
				pause = false;

			} else {

				controls.enabled = false;
				pause = true;
				blocker.style.display = 'table';
				blocker.style.display = '-moz-box';
				blocker.style.display = 'box';

				instructions.style.display = '';

			}

		}

		var pointerlockerror = function ( event ) {

			instructions.style.display = '';

		}

		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

		instructions.addEventListener( 'click', function ( event ) {

			instructions.style.display = 'none';

			// Ask the browser to lock the pointer
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

			if ( /Firefox/i.test( navigator.userAgent ) ) {

				var fullscreenchange = function ( event ) {

					if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

						document.removeEventListener( 'fullscreenchange', fullscreenchange );
						document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

						element.requestPointerLock();
					}

				}

				document.addEventListener( 'fullscreenchange', fullscreenchange, false );
				document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

				element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

				element.requestFullscreen();

			} else {

				element.requestPointerLock();

			}

		}, false );

	} else {

		instructions.innerHTML = "Your browser doesn't seem to support Pointer Lock API";

	}
	// ============================
	// === POINTER LOCKER START ===
	// ============================

	// =========================
	// === STATS FPS - START ===
	// =========================
	var stats = new Stats();
	stats.setMode(); // 0: fps, 1: ms

	// Align top-left
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';

	document.body.appendChild( stats.domElement );

	setInterval( function () {

	    stats.begin();
	    // your code goes here
	    stats.end();

	}, 1000 / 60 );
	// =========================
	// === STATS FPS - START ===
	// =========================

    // ================================
    // ======== SCRIPTS LOADED - END
    // ================================

});