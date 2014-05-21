$.when(
    // ================================
    // ======== SCRIPTS 
    // ================================
    $.getScript( "/js/vendor/three-js/build/three.min.js" ),
    $.getScript( "/js/vendor/three-js/examples/js/libs/stats.min.js" ),
    $.getScript( "/js/vendor/three-js/examples/js/Detector.js" ),
    // === controls
    $.getScript( "/js/vendor/three-js/examples/js/controls/TrackballControls.js" ),
    // === loaders
    $.getScript( "/js/vendor/three-js/examples/js/loaders/MTLLoader.js" ),
    $.getScript( "/js/vendor/three-js/examples/js/loaders/OBJLoader.js" ),
    $.getScript( "/js/vendor/three-js/examples/js/loaders/OBJMTLLoader.js" ),
    $.getScript( "/js/vendor/three-js/examples/js/loaders/PDBLoader.js" ),

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

    var loader = new THREE.OBJMTLLoader();

    var list_of_models = [

    ["max-1", "max/maxOno.obj","max/maxOno.mtl", 300],
    ["Female", "female02/female02.obj","female02/female02.mtl", 150],
    ["Male", "male02/male02.obj","male02/male02_dds.mtl", 150],
    ["Raptor", "raptor/Raptor.obj","raptor/Raptor.mtl", 150],
    ["Altair", "Altair/altair.obj","Altair/star_wars.mtl", 150],
    ["Armchair", "Armchair/Armchair.obj","Armchair/Armchair.mtl", 300],
    ["Boat", "boat/boat.obj","boat/boat.mtl", 300]

    ];

    var last_item;

    init();
    animate();
    makeMenu();

    function init() {

        container = document.createElement( 'div' );
        document.body.appendChild( container );

        camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 2000 );
        camera.position.z = 100;

        // scene

        scene = new THREE.Scene();

        var ambient = new THREE.AmbientLight( 0x444444 );
        scene.add( ambient );

        var directionalLight = new THREE.DirectionalLight( 0xffeedd );
        directionalLight.position.set( 0, 0, 1 ).normalize();
        scene.add( directionalLight );

        // model

        // loader.load( '/models/obj/' + list_of_models[0][1], '/models/obj/' + list_of_models[0][2], function ( object ) {

        //     object.position.y = - 100;
        //     scene.add( object );

        // } );

        loadObj('/models/obj/' + list_of_models[0][1], '/models/obj/' + list_of_models[0][2], list_of_models[0][3]);

        //

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );

        document.addEventListener( 'mousemove', onDocumentMouseMove, false );

        //

        window.addEventListener( 'resize', onWindowResize, false );

    }

    function loadObj ( obj, skin, size ) {
        //console.log(scene.children[ 2 ]);
        scene.remove(scene.children[ 2 ]);

        loader.load( obj, skin, function ( object ) {
            object.position.y = - 100;
            camera.position.z = size;

            last_item = scene.add( object );

        } );
    }

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function onDocumentMouseMove( event ) {

        mouseX = ( event.clientX - windowHalfX ) / 2;
        mouseY = ( event.clientY - windowHalfY ) / 2;

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

    function makeMenu() {
        var $someelement = $('<div id="menu"/>').appendTo('body');
       
        $.each(list_of_models, function( index, values) {
            link = $('<button data-obj="'+values[1]+'" data-skin="'+values[2]+'" data-size="'+values[3]+'" >'+values[0]+'</button>').appendTo('#menu');
            // link.click(loadNewModal(link));
        });
        $('#menu button').first().addClass('selected');
        $('#menu button').click(function() {
            $('#menu button').removeClass('selected');
            $(this).addClass('selected');
            obj = $(this).attr( "data-obj" );
            skin = $(this).attr( "data-skin" );
            size = $(this).attr( "data-size" );
            loadObj('/models/obj/' + obj, '/models/obj/' + skin, size);
        });
        
    }

    // ================================
    // ======== SCRIPTS LOADED - START
    // ================================

});
