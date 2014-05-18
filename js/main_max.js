$.when(
    // ================================
    // ======== SCRIPTS 
    // ================================
    $.getScript( "/js/vendor/three-js/build/three.min.js" ),
    $.getScript( "/js/vendor/three-js/examples/js/libs/stats.min.js" ),
    $.getScript( "/js/vendor/three-js/examples/js/Detector.js" ),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })

).done(function(){

    // ================================
    // ======== SCRIPTS LOADED - START
    // ================================

    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    var camera, scene, renderer;
    var meshes = [];

    init();
    animate();  


    function init() {

        camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
        camera.position.z = 1000;

        scene = new THREE.Scene();

        geometry = new THREE.BoxGeometry( 200, 200, 200 );

        /*
        This is how compressed textures are supposed to be used:

        DXT1 - RGB - opaque textures
        DXT3 - RGBA - transparent textures with sharp alpha transitions
        DXT5 - RGBA - transparent textures with full alpha range
        */
                                    
        var map1 = THREE.ImageUtils.loadDDSTexture( '../js/vendor/three-js/textures/disturb_dxt1_nomip.dds' );
        map1.minFilter = map1.magFilter = THREE.LinearFilter;
        map1.anisotropy = 4;

        var map2 = THREE.ImageUtils.loadDDSTexture( '../js/vendor/three-js/textures/disturb_dxt1_mip.dds' );
        map2.anisotropy = 4;

        var map3 = THREE.ImageUtils.loadDDSTexture( '../js/vendor/three-js/textures/hepatica_dxt3_mip.dds' );
        map3.anisotropy = 4;

        var map4 = THREE.ImageUtils.loadDDSTexture( '../js/vendor/three-js/textures/explosion_dxt5_mip.dds' );
        map4.anisotropy = 4;

        var map5 = THREE.ImageUtils.loadDDSTexture( '../js/vendor/three-js/textures/disturb_argb_nomip.dds' );
        map5.minFilter = map5.magFilter = THREE.LinearFilter;
        map5.anisotropy = 4;

        var map6 = THREE.ImageUtils.loadDDSTexture( '../js/vendor/three-js/textures/disturb_argb_mip.dds' );
        map6.anisotropy = 4;

        var cubemap1 = THREE.ImageUtils.loadDDSTexture( '../js/vendor/three-js/textures/Mountains.dds', new THREE.CubeReflectionMapping, function( cubemap ) {
            cubemap1.magFilter = cubemap1.minFilter = THREE.LinearFilter;
            material1.needsUpdate = true;

        } );

        var cubemap2 = THREE.ImageUtils.loadDDSTexture( '../js/vendor/three-js/textures/Mountains_argb_mip.dds', new THREE.CubeReflectionMapping, function( cubemap ) {
            cubemap2.magFilter = cubemap2.minFilter = THREE.LinearFilter;
            material5.needsUpdate = true;
        } );

        var cubemap3 = THREE.ImageUtils.loadDDSTexture( '../js/vendor/three-js/textures/Mountains_argb_nomip.dds', new THREE.CubeReflectionMapping, function( cubemap ) {
            cubemap3.magFilter = cubemap3.minFilter = THREE.LinearFilter;
            material6.needsUpdate = true;
        } );


        var material1 = new THREE.MeshBasicMaterial( { map: map1, envMap: cubemap1 } );
        var material2 = new THREE.MeshBasicMaterial( { map: map2 } );
        var material3 = new THREE.MeshBasicMaterial( { map: map3, alphaTest: 0.5, side: THREE.DoubleSide } );
        var material4 = new THREE.MeshBasicMaterial( { map: map4, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthTest: false, transparent: true } );
        var material5 = new THREE.MeshBasicMaterial( { envMap: cubemap2 } );
        var material6 = new THREE.MeshBasicMaterial( { envMap: cubemap3 } );
        var material7 = new THREE.MeshBasicMaterial( { map: map5 } );
        var material8 = new THREE.MeshBasicMaterial( { map: map6 } );
        

        var mesh = new THREE.Mesh( new THREE.TorusGeometry( 100, 50, 32, 16 ), material1 );
        mesh.position.x = -600;
        mesh.position.y = -200;
        scene.add( mesh );
        meshes.push( mesh );

        mesh = new THREE.Mesh( geometry, material2 );
        mesh.position.x = -200;
        mesh.position.y = -200;
        scene.add( mesh );
        meshes.push( mesh );

        mesh = new THREE.Mesh( geometry, material3 );
        mesh.position.x = -200;
        mesh.position.y = 200;
        scene.add( mesh );
        meshes.push( mesh );

        mesh = new THREE.Mesh( geometry, material4 );
        mesh.position.x = -600;
        mesh.position.y = 200;
        scene.add( mesh );
        meshes.push( mesh );

        mesh = new THREE.Mesh( new THREE.BoxGeometry( 200, 200, 200 ), material5 );
        mesh.position.x = 200;
        mesh.position.y = 200;
        scene.add( mesh );
        meshes.push( mesh );

        mesh = new THREE.Mesh( new THREE.BoxGeometry( 200, 200, 200 ), material6 );
        mesh.position.x = 200;
        mesh.position.y = -200;
        scene.add( mesh );
        meshes.push( mesh );

        mesh = new THREE.Mesh( geometry, material7 );
        mesh.position.x = 600;
        mesh.position.y = -200;
        scene.add( mesh );
        meshes.push( mesh );

        mesh = new THREE.Mesh( geometry, material8 );
        mesh.position.x = 600;
        mesh.position.y = 200;
        scene.add( mesh );
        meshes.push( mesh );


        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        stats = new Stats();
        document.body.appendChild( stats.domElement );

        window.addEventListener( 'resize', onWindowResize, false );

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function animate() {

        requestAnimationFrame( animate );

        var time = Date.now() * 0.001;

        for ( var i = 0; i < meshes.length; i ++ ) {

            var mesh = meshes[ i ];
            mesh.rotation.x = time;
            mesh.rotation.y = time;

        }

        renderer.render( scene, camera );
        stats.update();

    }

    // ================================
    // ======== SCRIPTS LOADED - START
    // ================================

});