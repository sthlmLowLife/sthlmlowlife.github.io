$.when(
    // ================================
    // ======== SCRIPTS 
    // ================================

    // === init
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

    // === loaders
    $.getScript( "/js/max/collada_loader.js" ),


    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })

).done(function(){

    // ================================
    // ======== SCRIPTS LOADED - START
    // ================================

    var loader = new THREE.ColladaLoader();
        loader.load('/models/dae/.dae', function (result) {
        scene.add(result.scene);
    });

    // ================================
    // ======== SCRIPTS LOADED - START
    // ================================

});
