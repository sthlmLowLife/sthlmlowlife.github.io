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

    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })

).done(function(){

    // ================================
    // ======== SCRIPTS LOADED - START
    // ================================

    

    // ================================
    // ======== SCRIPTS LOADED - START
    // ================================

});
