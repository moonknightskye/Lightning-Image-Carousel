({
    doInit : function(component, event, helper) {
        var id = (new Date()).getTime( );
        if( !component.get('v.links') )
            component.set( "v.links", "" );
        if( !component.get('v.images') )
            component.set( "v.images", "" );
        component.set( "v.id", id );
        component.set( "v.image_list", [component.get('v.image_1'), component.get('v.image_2'), component.get('v.image_3'), component.get('v.image_4'), component.get('v.image_5')] );
        component.set( "v.link_list", [component.get('v.link_1'), component.get('v.link_2'), component.get('v.link_3'), component.get('v.link_4'), component.get('v.link_5')] );
        $A[ 'lightning-slideshow' ] = {};
        var grayscale = component.get( "v.effect");
        switch( grayscale ){
            case 'Invert':
                component.set( "v.effect_class", "invert" );
                break;
            case 'Grayscale light':
                component.set( "v.effect_class", "gray_light" );
                break;
            case 'Grayscale strong':
                component.set( "v.effect_class", "gray_strong" );
                break;
            case 'Sepia light':
                component.set( "v.effect_class", "sepia_light" );
                break;
            case 'Sepia strong':
                component.set( "v.effect_class", "sepia_strong" );
                break;
            case 'Blur light':
                component.set( "v.effect_class", "blur_light" );
                break;
            case 'Blur strong':
                component.set( "v.effect_class", "blur_strong" );
                break;
            default:
                component.set( "v.effect_class", "" );
        };
       if( component.get( "v.isWallpaperMode") ){
            component.set( "v.fitMode", "Both" );
            component.set( "v.hidecontrols", true );
            component.set( "v.fullscreen_class", "full_screen" );
        };
    },
    afterScriptsLoaded : function(component, event, helper) {  
        $A[ 'lightning-slideshow' ] = new Slideshow();
        
       $A[ 'lightning-slideshow' ].init( { 
            id: component.get('v.id'),
            height:  component.get('v.height'),
            width:  component.get('v.width'),
            hidecontrols: component.get('v.hidecontrols'),
            backgroundcolor:  component.get('v.backgroundcolor'),
            fitMode:  component.get('v.fitMode'),
            isWallpaperMode:  component.get('v.isWallpaperMode'),
            autoplay:  component.get('v.autoplay'),
            autoplaytimeout: component.get('v.autoplaytimeout'),
            direction:  component.get('v.direction'),
            image_list: component.get('v.image_list'),
            link_list: component.get('v.link_list'),
            images: component.get('v.images'),
            onSwitch: utility.toJSON( component.get('v.onSwitch') ),
            animationType: component.get('v.animationType'),
            links: component.get('v.links').split(',')
        } );
        
        utility.onPageLoad( function(){
            utility.onWindowResize( $A[ 'lightning-slideshow' ].adjustImgSizeOnWinResize );
        });
        
        utility.init( );

    }
})