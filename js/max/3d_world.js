$.when(
    // ================================
    // ======== SCRIPTS 
    // ================================
    $.getScript( "http://experiment1/js/vendor/three-js/build/three.min.js" ),
    $.getScript( "http://experiment1/js/vendor/three-js/examples/js/libs/stats.min.js" ),
    $.getScript( "http://experiment1/js/vendor/three-js/examples/js/Detector.js" ),
    // === controls
    $.getScript( "http://experiment1/js/vendor/three-js/examples/js/controls/TrackballControls.js" ),
    // === loaders
    $.getScript( "http://experiment1/js/vendor/three-js/examples/js/loaders/MTLLoader.js" ),
    $.getScript( "http://experiment1/js/vendor/three-js/examples/js/loaders/OBJLoader.js" ),
    $.getScript( "http://experiment1/js/vendor/three-js/examples/js/loaders/OBJMTLLoader.js" ),
    $.getScript( "http://experiment1/js/vendor/three-js/examples/js/loaders/PDBLoader.js" ),

    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })

).done(function(){

	  // ================================
    // ======== SCRIPTS LOADED - START
    // ================================
	var container, stats;

			var camera, scene, renderer;

			var mouseX = 0, mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;


			init();
			animate();


			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.z = 200;

				// scene

				scene = new THREE.Scene();

				var ambient = new THREE.AmbientLight( 0x444444 );
				scene.add( ambient );

				var directionalLight = new THREE.DirectionalLight( 0xffeedd );
				directionalLight.position.set( 0, 0, 1 ).normalize();
				scene.add( directionalLight );

				// model

				var loader = new THREE.OBJMTLLoader();
				loader.load( 'http://experiment1/models/obj/weed/weed.obj', 'http://experiment1/models/obj/weed/weed.mtl', function ( object ) {

					object.position.y = 0;
					object.position.x = -40;
					object.rotation.y = 1000;
					scene.add( object );

				} );

				//

				renderer = new THREE.WebGLRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.setClearColor(0xFFCC99, 1);
				container.appendChild( renderer.domElement );

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseMove( event ) {

				mouseX = ( event.clientX - windowHalfX ) / 5;
				mouseY = ( event.clientY - windowHalfY ) / 5;

			}

			//

			function animate() {

				requestAnimationFrame( animate );
				render();

			}

			function render() {

				camera.position.x += ( mouseX - camera.position.x ) * .05;
				camera.position.y += ( - mouseY - camera.position.y ) * .05;

				camera.lookAt( scene.position );

				renderer.render( scene, camera );

			}
   
    // ================================
    // ======== SCRIPTS LOADED - START
    // ================================

});