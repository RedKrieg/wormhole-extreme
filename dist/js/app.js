/**
 * App scripts
 */
(function()
{
    // elements
    var body      = document.body,
        loader    = document.querySelector( ".loader" ),
        content   = document.querySelector( ".content" ),
        error     = document.querySelector( ".error" ),
        share     = document.querySelector( ".share" ),
        stats     = document.querySelector( ".stats" ),
        hyperBtn  = document.getElementById( "hyper-btn" ),
        shareBtns = document.querySelectorAll( "[data-share]" ) || [];

    // setup main stage
    var stage = new Stage( "stage-container", {
        alpha: true,
        antialias: true,
        precision: "mediump"
    });

    // setup share buttons
    for( var i = 0; i < shareBtns.length; i++ )
    {
        shareBtns[ i ].addEventListener( "click", function( e )
        {
            e.preventDefault();

            var service = this.getAttribute( "data-share" ) || "";
            var url     = String( window.location.href || "" );
            var title   = String( document.title || "" );
            var info    = String( document.querySelector( "#description" ).getAttribute( "content" ) || "" );
            var status  = String( info + " | " + url ).replace( /[\r\n\t\s]+/g, " " );

            switch( service )
            {
                case "twitter":
                    return window.open( "//twitter.com/home?status="+ encodeURIComponent( status ), "_blank" );

                case "facebook":
                    return window.open( "//facebook.com/sharer/sharer.php?u="+ encodeURIComponent( url ) + "&t=" + encodeURIComponent( title ), "_blank" );

                case "reddit":
                    return window.open( "//reddit.com/submit?url="+ encodeURIComponent( url ) + "&title=" + encodeURIComponent( title ), "_blank" );
            }
        });
    }

    // zoom in on press
    stage.onEvent( "onPress", function( mouse )
    {
        this.triggerEvent( "zoomIn" );
    });

    // zoom out on release
    stage.onEvent( "onRelease", function( mouse )
    {
        this.triggerEvent( "zoomOut" );
    });

    // move stage camera
    stage.onEvent( "onUp", function( code )
    {
        if( this.move.z > -10000 )
        {
            this.move.z -= 200;
        }
    });

    // move stage camera
    stage.onEvent( "onDown", function( code )
    {
        if( this.move.z < 200 )
        {
            this.move.z += 200;
        }
    });

    // move stage camera
    stage.onEvent( "onLeft", function( code )
    {
        if( this.move.x > -400 )
        {
            this.move.x -= 20;
            this.look.y -= 0.01;
        }
    });

    // move stage camera
    stage.onEvent( "onRight", function( code )
    {
        if( this.move.x < 400 )
        {
            this.move.x += 20;
            this.look.y += 0.01;
        }
    });

    // something went wrong during init or preload
    stage.onEvent( "onError", function( info )
    {
        loader.classList.remove( "active" );
        content.classList.remove( "active" );
        error.classList.add( "active" );
        error.querySelector( ".error-info" ).innerHTML = info;
    });

    // everything loaded successfully
    stage.onEvent( "onInit", function( now )
    {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        var title = content.querySelector("#content_title");
        title.innerHTML = urlParams.get("title") || title.innerHTML;
        var description = content.querySelector("#content_description");
        description.innerHTML = urlParams.get("description") || description.innerHTML;
        loader.classList.remove( "active" );
        error.classList.remove( "active" );
        content.classList.add( "active" );
        share.classList.add( "active" );
        //stats.classList.add( "active" );

        /*
	    setInterval( function() {
            stats.innerHTML = stage.getFps();
        }, 300 );
	    */

        // enter hyperspace automatically
        setInterval(function()
        {
            content.classList.remove( "active" );
            share.classList.remove( "active" );
            stage.triggerEvent( "hyperStart" );

            setTimeout( function()
            {
                content.classList.add( "active" );
                share.classList.add( "active" );
                stage.triggerEvent( "hyperStop" );

            }, 2500 );
        }, 20000);
    });

    // add objects to stage and init
    stage.addObject( new Nebula() );
    stage.addObject( new Stars() );
    stage.addObject( new Planets() );
    stage.addObject( new Wormhole() );
    stage.init();
})();
