$.when(
    // ================================
    // ======== SCRIPTS 
    // ================================

    // === init
    $.getScript( "/js/vendor/three-js/examples/js/libs/stats.min.js" ),
    $.getScript( "/js/vendor/cannon.min.js" ),
    $.getScript( "/js/max/fps/fps-controls.js" ),
    // $.getScript( "/js/vendor/three-js/examples/js/Detector.js" ),

    // === controls
    // $.getScript( "/js/vendor/three-js/examples/js/controls/TrackballControls.js" ),

    // === loaders
    // $.getScript( "/js/max/3d_world_controls.js" ),
    // $.getScript( "/js/vendor/three-js/examples/js/loaders/MTLLoader.js" ),
    // $.getScript( "/js/vendor/three-js/examples/js/loaders/OBJLoader.js" ),
    // $.getScript( "/js/vendor/three-js/examples/js/loaders/OBJMTLLoader.js" ),
    // $.getScript( "/js/vendor/three-js/examples/js/loaders/PDBLoader.js" ),

    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })

).done(function(){

	// ================================
    // ======== SCRIPTS LOADED - START
    // ================================

	var sphereShape, sphereBody, world, physicsMaterial, walls=[], balls=[], ballMeshes=[], boxes=[], boxMeshes=[];

    var camera, scene, renderer;
    var geometry, material, mesh;
    var controls,time = Date.now();

    var blocker = document.getElementById( 'blocker' );
    var instructions = document.getElementById( 'instructions' );

    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    var pause = true;

    var lastKeyPressed;

    initCannon();
    init();
    animate();
    setInterval(variableCheck, 500);

    // =======================
	// === FUNCTIONS START ===
	// =======================

    function initCannon(){
        // Setup our world
        world = new CANNON.World();
        world.quatNormalizeSkip = 0;
        world.quatNormalizeFast = false;
        world.solver.setSpookParams(300,10);
        world.solver.iterations = 5;
        world.gravity.set(0,-20,0);
        world.broadphase = new CANNON.NaiveBroadphase();

        // Create a slippery material (friction coefficient = 0.0)
        physicsMaterial = new CANNON.Material("slipperyMaterial");
        var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
                                                                physicsMaterial,
                                                                0.0, // friction coefficient
                                                                0.3  // restitution
                                                                );
        // We must add the contact materials to the world
        world.addContactMaterial(physicsContactMaterial);

        // Create a sphere
        var mass = 5, radius = 1.3;
        sphereShape = new CANNON.Sphere(radius);
        sphereBody = new CANNON.RigidBody(mass,sphereShape,physicsMaterial);
        sphereBody.position.set(0,5,20);
        sphereBody.linearDamping = 0.05;
        world.add(sphereBody);

        // Create a plane
        var groundShape = new CANNON.Plane();
        var groundBody = new CANNON.RigidBody(0,groundShape,physicsMaterial);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
        world.add(groundBody);
    }

    function init() {

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog( 0x000000, 0, 500 );

        var ambient = new THREE.AmbientLight( 0x004444, 1.25 );
        scene.add( ambient );

        light = new THREE.SpotLight( 0xffeeee );
        light.position.set( 10, 30, 20 );
        light.target.position.set( 0, 0, 0 );
        if(true){
            light.castShadow = true;

            light.shadowCameraNear = 20;
            light.shadowCameraFar = 50;//camera.far;
            light.shadowCameraFov = 40;

            light.shadowMapBias = 0.1;
            light.shadowMapDarkness = 0.7;
            light.shadowMapWidth = 2*512;
            light.shadowMapHeight = 2*512;

            //light.shadowCameraVisible = true;
        }
        scene.add( light );



        controls = new PointerLockControls( camera , sphereBody );
        scene.add( controls.getObject() );

        // floor
        geometry = new THREE.PlaneGeometry( 300, 300, 50, 50 );
        geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

        material = new THREE.MeshLambertMaterial( { color: 0x00ffff } );
		material_wireframe = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true  } );

        THREE.ColorUtils.adjustHSV( material.color, 0, 0, 0.9 );

        mesh = new THREE.Mesh( geometry, material_wireframe );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add( mesh );

        renderer = new THREE.WebGLRenderer();
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor( scene.fog.color, 1 );

        document.body.appendChild( renderer.domElement );

        window.addEventListener( 'resize', onWindowResize, false );

        // Add boxes
        var halfExtents = new CANNON.Vec3(.5,.5,.5);
        console.log(halfExtents.y);
        var boxShape = new CANNON.Box(halfExtents);
        var boxGeometry = new THREE.CubeGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
        for(var y=0; y<3; y++){
            for(var x=1; x<3; x++){
                for(var z=1; z<3; z++){

                    var xPos = (x)*(halfExtents.x + .5);
                    var yPos = (y)*(halfExtents.y + .5);
                    var zPos = (z)*(halfExtents.z + .5);
                    var boxBody = new CANNON.RigidBody(1,boxShape);
                    var boxMesh = new THREE.Mesh( boxGeometry, material );
                    world.add(boxBody);
                    scene.add(boxMesh);
                    boxBody.position.set(xPos,yPos,zPos);
                    boxMesh.position.set(xPos,yPos,zPos);
                    boxMesh.castShadow = false;
                    // boxMesh.castShadow = true;
                    boxMesh.receiveShadow = true;
                    boxMesh.useQuaternion = true;
                    boxes.push(boxBody);
                    boxMeshes.push(boxMesh);

                }
            }
        }

        // Add linked boxes
        var size = 0.5;
        var he = new CANNON.Vec3(size,size,size*0.1);
        var boxShape = new CANNON.Box(he);
        var mass = 0;
        var space = 0.1*size;
        var N=5, last;

        var radius = 1;
		var segments = 2;

		var boxGeometry = new THREE.CircleGeometry( radius, segments );
        // var boxGeometry = new THREE.CubeGeometry(he.x*2,he.y*2,he.z*2);
        for(var i=0; i<N; i++){
            var boxbody = new CANNON.RigidBody(mass,boxShape);
            var boxMesh = new THREE.Mesh( boxGeometry, material );
            boxbody.position.set(5,(N-i)*(size*2+2*space) + size*2+space,0);
            boxbody.linearDamping=0.01;
            boxbody.angularDamping=0.01;
            boxMesh.useQuaternion = true;
            boxMesh.castShadow = true;
            boxMesh.receiveShadow = true;
            world.add(boxbody);
            scene.add(boxMesh);
            boxes.push(boxbody);
            boxMeshes.push(boxMesh);

            if(i!=0){
                // Connect this body to the last one
                var c1 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(-size,size+space,0),last,new CANNON.Vec3(-size,-size-space,0));
                var c2 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(size,size+space,0),last,new CANNON.Vec3(size,-size-space,0));
                world.addConstraint(c1);
                world.addConstraint(c2);
            } else {
                mass=0.3;
            }
            last = boxbody;
        }
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    var dt = 1/60;
    function animate() {
        requestAnimationFrame( animate );
        if(controls.enabled){
            world.step(dt);

            // Update ball positions
            for(var i=0; i<balls.length; i++){
                balls[i].position.copy(ballMeshes[i].position);
                balls[i].quaternion.copy(ballMeshes[i].quaternion);
            }

            // Update box positions
            for(var i=0; i<boxes.length; i++){
                boxes[i].position.copy(boxMeshes[i].position);
                boxes[i].quaternion.copy(boxMeshes[i].quaternion);
            }
        }

		shoot();

        controls.update( Date.now() - time );
        renderer.render( scene, camera );
        time = Date.now();

    }

    var ballShape = new CANNON.Sphere(0.2);
    var ballGeometry = new THREE.SphereGeometry(ballShape.radius);
    var shootDirection = new THREE.Vector3();
    var shootVelo = 30;
    var projector = new THREE.Projector();
    function getShootDir(targetVec){
        var vector = targetVec;
        targetVec.set(0,0,1);
        projector.unprojectVector(vector, camera);
        var ray = new THREE.Ray(sphereBody.position, vector.subSelf(sphereBody.position).normalize() );
        targetVec.x = ray.direction.x;
        targetVec.y = ray.direction.y;
        targetVec.z = ray.direction.z;
    }

    var mousedown = false;

    window.addEventListener("mousedown",function(e){ 
        if(controls.enabled==true){
            mousedown = true;
        }
    });
    window.addEventListener("mouseup", function(e){
        mousedown = false;
    });

    var count = 0;

    function shoot(){

        if ( mousedown === true ) {

            var id = count % 200;
            var x = sphereBody.position.x;
            var y = sphereBody.position.y;
            var z = sphereBody.position.z;

            var ballBody, ballMesh;

            if ( balls[ id ] === undefined ) {

                ballBody = new CANNON.RigidBody(1,ballShape);
                ballMesh = new THREE.Mesh( ballGeometry, material_wireframe );
                world.add(ballBody);
                scene.add(ballMesh);
                ballMesh.castShadow = false;
                // ballMesh.castShadow = true;
                ballMesh.receiveShadow = true;
                balls.push(ballBody);
                ballMeshes.push(ballMesh);

            } else {

                ballBody = balls[ id ];
                ballMesh = ballMeshes[ id ];

            }

            getShootDir(shootDirection);
            ballBody.velocity.set(  shootDirection.x * shootVelo,
                                    shootDirection.y * shootVelo,
                                    shootDirection.z * shootVelo);

            // Move the ball outside the player sphere
            x += shootDirection.x * (sphereShape.radius + ballShape.radius);
            y += shootDirection.y * (sphereShape.radius + ballShape.radius);
            z += shootDirection.z * (sphereShape.radius + ballShape.radius);
            ballBody.position.set(x,y,z);
            ballMesh.position.set(x,y,z);
            ballMesh.useQuaternion = true;

            count ++;

        }

    }

    $(function () {
    	$(document).keyup(function (e) {
    		lastKeyPressed = e.keyCode;
    	});
    });

    function variableCheck () {
    	$('.debug').html('');
    	$('.debug').append("<p>"+pause+" : pause</p>");
    	$('.debug').append("<p>"+controls.enabled+" : controls.enabled</p>");

    	$('.debug').append("<p>"+lastKeyPressed+" : lastKeyPressed</p>");
	}
	// =======================
	// === FUNCTIONS END ===
	// =======================

	// =========================
	// === STATS FPS - START ===
	// =========================

	var stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms

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
	// === STATS FPS - END ===
	// =========================

	// ============================
	// === POINTER LOCKER START ===
	// ============================

	if ( havePointerLock ) {

        var element = document.body;

        var pointerlockchange = function ( event ) {

            if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

                controls.enabled = true;

                pause = false;

                blocker.style.display = 'none';

            } else {

                controls.enabled = false;

                pause = true;

                blocker.style.display = 'table';

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

        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

    }

	// ============================
	// === POINTER LOCKER END ===
	// ============================

    // ================================
    // ======== SCRIPTS LOADED - END
    // ================================

});