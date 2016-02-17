var Slideshow = function () {

    var slideElem = {},
        current = 1,
        total = 0,
        loadingImageList = [],
        isLoading = true,
        loadingTimer = -1,
        buttonLock = true,
        touchPoints = {
            startX : 0,
            startY : 0
        },
        isRotationLocked = true,
        animationType,
        links,
        fitMode,
        isWallpaperMode,
        isAutoplay,
        autoplaytimeout,
        autoplaytimer,
        direction,
        hidecontrols,
        onSwitch;
    
    function init( param ){
        slideElem = document.getElementById( 'lightning-slideshow' + param.id );
        animationType = param.animationType.toLowerCase();

        links = processURLLinks(param.link_list, param.links);
        onSwitch = param.onSwitch;
        isWallpaperMode = param.isWallpaperMode;
        if(isWallpaperMode){
            slideElem.style.height = getDocHeight() + 'px';
            slideElem.style.width = '100%';
        }else{
            slideElem.style.height = param.height;
            slideElem.style.maxWidth = param.width;
        };
        fitMode = param.fitMode;
        isAutoplay = param.autoplay;
        autoplaytimeout = param.autoplaytimeout;
        direction = param.direction.toLowerCase();
        onSwitch = param.onSwitch;

		slideElem.style.backgroundColor = param.backgroundcolor.toLowerCase();
        
        if( utility.isTouchDevice( ) )
            slideElem.classList.add( 'mobile' );
        else
            slideElem.classList.add( 'desktop' );
	                        
        param.images = processImageFilename(param.image_list, param.images);
        
        total = param.images.length;
        var dots = slideElem.getElementsByClassName( 'dots' )[ 0 ];
        var i = total -1;
        if( i > 0 ){
            for( i; i >=0; i-- ){
                (function( i ){
                    appendImage( param.images[ i ],  i + 1 );
                    var dotli = document.createElement( 'li' );
                    var dota = document.createElement( 'a' );
                    dotli.appendChild( dota );
                    dots.appendChild( dotli );
                    dota.dataset.imageNumber =  total - i;
                    if( i == total-1 ) dota.classList.add( 'active' );
                })( i ); 
            };
        }else{
            isAutoplay = false;
        };
    };
    
    function processURLLinks(list, param){
        var i = list.length-1;
        for( i; i >= 0; i--){
            (function(i){
                if( list[i] && list[i].length < 3 )
                    list.splice(i);
            })(i); 
        };
        return list.concat(param);
    };
    
    function processImageFilename( list, param ){
        var i = list.length-1;
        for( i; i >= 0; i--){
            (function(i){
                if( list[i] && list[i].length > 3 )
                    list[i] = list[i].trim(); //list[i] = '/resource/' + list[i].trim();
                else
                    list.splice(i);
            })(i); 
        };
        var images = param.split( ',' );
        i = images.length - 1;
        for( i; i >= 0; i--){
            (function(i){
                if( images[i].length >= 3 )
                    images[i] = images[i].trim();  //images[i] = '/resource/' + images[i].trim();
                else
                    images.splice(i);
            })(i); 
        };
        if( list.length < 1 ) return images;
       return list.concat(images);
    };
    
    function imageLoaded(){
        var ulElem = slideElem.getElementsByClassName( 'image-list' )[ 0 ];
        var controls = slideElem.getElementsByClassName( 'controls' )[ 0 ];
        var imageController = slideElem.getElementsByClassName( 'image-button' )[ 0 ];
        ulElem.classList.add( 'fadein' );
		buttonLock = false;
        var leftButton = slideElem.getElementsByClassName( 'left-button' )[0];
        if( leftButton ) leftButton.addEventListener( 'click', function(e){ slideRight(); } );
        var rightButton = slideElem.getElementsByClassName( 'right-button' )[0];
        if( rightButton ) rightButton.addEventListener( 'click', function(e){ slideLeft(); } );
        
        if( utility.isTouchDevice( ) ){
            imageController.addEventListener( 'touchstart', imageTouchStart );
            imageController.addEventListener( 'touchmove', imageTouchMove );
            imageController.addEventListener( 'touchend', imageTouchEnd );
        };
        
       	imageController.addEventListener( 'click', imageClick );
        if( links[ current -1 ] )
        	controls.classList.add( 'link-enabled' );
        
        autoplay( );
        executeOnSwitchEvent( );
    };
    
    function autoplay( ){
       if( !isAutoplay) return;
        
        clearInterval( autoplaytimer );
        autoplaytimer = window.setInterval( function(){
            ( direction == "left" ) ? slideLeft( true ) : slideRight( true );
        },  autoplaytimeout * 1000 );
    };
    
    function imageClick( e ){
         if( !isRotationLocked ) return;
        
        if( e.target.nodeName === 'A' ){
            var dot = e.target;
            var dotNum = dot.dataset.imageNumber;
            if( dotNum == current ) return;
            
            jumpPage( dotNum );
        }else{
             if( links[ current - 1] &&  links[ current - 1].length > 1 ){
                window.location.href = links[ current - 1];
            };
        }; 
    };
    
    function updatePager( num ){
            var dotParent = slideElem.getElementsByClassName( 'dots' )[ 0 ];
        	if( !dotParent ) return;
 			var dots = dotParent.getElementsByTagName( 'a' );
            var i = 0;
            for( i = dots.length -1; i >=0; i-- ){
                ( function( i ){
                    dots[ i ].classList.remove( 'active' );
                    if( num ){
                       if( num == i + 1 )
                           dots[ i ].classList.add( 'active' );
                    }else{
                        if( current == i + 1 )
                            dots[ i ].classList.add( 'active' );
                    }
                })( i ); 
            };
    };
    
    function imageTouchStart( e ){
        isRotationLocked = true;
        utility.enableScroll( );
        var i = 0;
        for ( var i = 0; i < e.changedTouches.length; i++ ) {
        	if( i >= 1 ) return;
            
            var finger = event.changedTouches[ i ];
            touchPoints.startX = finger.pageX;
            touchPoints.startY = finger.pageY;
        };
    };
    
    function imageTouchMove( e ){
        if( !isRotationLocked ) return;
        var i = 0;
        for ( var i = 0; i < e.changedTouches.length; i++ ) {
        	if( i >= 1 ) return;
            
            var finger = event.changedTouches[ i ];
            var direction = touchPoints.startX - finger.pageX;
            var updown = touchPoints.startY - finger.pageY;
            if( updown >20 || updown < -20 ){
                utility.enableScroll( );
            }else{
                utility.disableScroll( );
            }
            if( direction < -100 ){
                isRotationLocked = false;
                utility.enableScroll( );
                slideRight();
            };
            if( direction > 100 ){
                isRotationLocked = false;
                utility.enableScroll( );
                 slideLeft();
            };
        };
    };
    
    function imageTouchEnd( e ){
        utility.enableScroll( );
    };
    
    function jumpPage( from ){
        if( buttonLock ) return;
        else buttonLock = true;
        
        autoplay( );
        
        var currentSlide = getImageSlide( current );
        if( !currentSlide ) return;
        var nextSlide = getImageSlide(  from );
        var controls = slideElem.getElementsByClassName( 'controls' )[ 0 ];
		current = from;
        updatePager( current );
        
        currentSlide.classList.add( 'naviout' );
        currentSlide.classList.remove( animationType + 'in-left', animationType + 'in-right', animationType + 'out-right', 'naviin'  )
        nextSlide.classList.add( 'naviin' );
        nextSlide.classList.remove( animationType + 'out-left', animationType + 'in-right', animationType + 'out-right', 'naviout', 'inactive'  );
        currentSlide.addEventListener( 'animationend', function( e ){
            currentSlide.removeEventListener( 'animationend' , arguments.callee);
            currentSlide.classList.remove( 'active' );
            currentSlide.classList.add( 'inactive' );
            if( links[ current -1 ] )
                 controls.classList.add( 'link-enabled' );
            buttonLock = false;
            executeOnSwitchEvent( );
        });
         nextSlide.addEventListener( 'animationend', function( e ){
         	nextSlide.removeEventListener( 'animationend' , arguments.callee);
            nextSlide.classList.add( 'active' );
        });
        controls.classList.remove( 'link-enabled' );
    };
    
    function executeOnSwitchEvent( ){
        if( onSwitch[ current -1 ] )  utility.execStringFunction( onSwitch[ current -1 ] );
    };
    
    function slideLeft( isAutomatic ){
        if( buttonLock ) return;
        else buttonLock = true;
        
        if( !isAutomatic ) autoplay( );
        
        var controls = slideElem.getElementsByClassName( 'controls' )[ 0 ];
        var currentSlide = getImageSlide( current );
        if( !currentSlide ) return;
        current++;
        if( current > total )
            current = 1;
        var nextSlide = getImageSlide( current );
        updatePager( );

        
        currentSlide.classList.add( animationType + 'out-left' );
        currentSlide.classList.remove( animationType + 'in-left', animationType + 'in-right', animationType + 'out-right', 'naviin'  )
        nextSlide.classList.add( animationType + 'in-left' );
        nextSlide.classList.remove( animationType + 'out-left', animationType + 'in-right', animationType + 'out-right', 'naviout', 'inactive'  );
        
        currentSlide.addEventListener( 'animationend', function( e ){
            currentSlide.removeEventListener( 'animationend' , arguments.callee);
            currentSlide.classList.remove( 'active' );
            currentSlide.classList.add( 'inactive' );
            if( links[ current -1 ] )
                 controls.classList.add( 'link-enabled' );
            buttonLock = false;
            executeOnSwitchEvent( );
        });
        nextSlide.addEventListener( 'animationend', function( e ){
            nextSlide.removeEventListener( 'animationend' , arguments.callee);
            nextSlide.classList.add( 'active' );
        });
        controls.classList.remove( 'link-enabled' );
    };
    
    function slideRight( isAutomatic ){
        if( buttonLock ) return;
        else buttonLock = true;
        
         if( !isAutomatic ) autoplay( );
        
        var controls = slideElem.getElementsByClassName( 'controls' )[ 0 ];
        var currentSlide = getImageSlide( current );
        if( !currentSlide ) return;
        current--;
        if( current < 1 )
            current = total;
        var nextSlide = getImageSlide( current );
        updatePager( );
        
        currentSlide.classList.add( animationType + 'out-right' );
        currentSlide.classList.remove( animationType + 'in-right', animationType + 'in-left', animationType + 'out-left', 'naviin' )
        nextSlide.classList.add( animationType + 'in-right' );
        nextSlide.classList.remove( animationType + 'out-right', animationType + 'in-left', animationType + 'out-left', 'naviout', 'inactive'  );
        
        currentSlide.addEventListener( 'animationend', function( e ){
            currentSlide.removeEventListener( 'animationend' , arguments.callee);
            currentSlide.classList.remove( 'active' );
            currentSlide.classList.add( 'inactive' );
           if( links[ current -1 ] )
                 controls.classList.add( 'link-enabled' );
            buttonLock = false;
            executeOnSwitchEvent( );
        });
        nextSlide.addEventListener( 'animationend', function( e ){
            nextSlide.removeEventListener( 'animationend' , arguments.callee);
            nextSlide.classList.add( 'active' );
        });
         controls.classList.remove( 'link-enabled' );
    };
    
    function getImageSlide( number ){
        var ulElem = slideElem.getElementsByClassName( 'image-list' )[ 0 ];
        if( ulElem )
        	return ulElem.querySelectorAll('[data-image-number = "' + number + '"]')[ 0 ];
    };
    
    function appendImage( filename, num ){
        var ulElem = slideElem.getElementsByClassName( 'image-list' )[ 0 ];
        var liElem = document.createElement( 'li' );
        liElem.classList.add( 'slide-image', getFilename( filename ) );
        liElem.dataset.imageNumber = num;
        
        if( num === 1 ){
            liElem.classList.add( 'active' );
        };
            
        ulElem.appendChild( liElem );
        var image = document.createElement("img");
        loadingImageList.push( image );
        image.onload = function() {
            liElem.appendChild( image );
            
            var img = liElem.getElementsByTagName( 'img' )[0];
            window.setTimeout( function(){
                image.dataset.width = image.width;
                image.dataset.height = image.height;
                if(fitMode == 'Both'){
                    wallPaperMode(image);
                }else if(fitMode == 'Height'){
                    if(image.height > image.width) {
                        image.style.maxWidth = '100%';
                        image.style.height = '100%';
                        image.style.maxHeight = 'initial';
                    }else{
                        image.style.maxHeight = '100%';
                        image.style.width = 'auto';
                        image.style.height = '100%';
                        image.style.maxWidth = 'none';
                    };
                    image.style.position = 'absolute';
                    image.style.top = '50%';
                    image.style.marginTop = - (img.height/2)  + 'px';
                    image.style.left = '50%';
                    image.style.marginLeft = - (img.width/2)  + 'px'; 
                }else{
                    image.style.width = '100%';
                    image.style.height = 'auto';
                    image.style.position = 'absolute';
                    image.style.top = '50%';
                    image.style.marginTop = - (img.height/2)  + 'px';
                };
                removeImageFromList( image.src );
            }, 300 );
        };
        image.src = filename;
        clearInterval( loadingTimer );
        loadingTimer = window.setInterval( checkLoading , 300 );
    };
    
    function wallPaperMode(image){
        var width =  getDocWidth(),
            height = getDocHeight();
        
        image.style.width = image.dataset.width + 'px';
        image.style.height = image.dataset.height + 'px';

        var aspect_width =  width / image.width;
        var aspect_height = height / image.height;

        if( aspect_height > aspect_width){
            image.style.height = (parseInt(image.dataset.height) * aspect_height) + 'px';
            image.style.width = (parseInt(image.dataset.width) * aspect_height)+ 'px';
        }else{
            image.style.height = (parseInt(image.dataset.height) * aspect_width) + 'px';
            image.style.width = (parseInt(image.dataset.width) * aspect_width)+ 'px';
        }
        image.style.position = 'absolute';
        image.style.top = '50%';
        image.style.marginTop = - (parseInt(image.style.height)/2)  + 'px';
        image.style.left = '50%';
        image.style.marginLeft = - (parseInt(image.style.width)/2)  + 'px';
    };

    function getDocHeight() {
        var D = document;
        if(isWallpaperMode)
            return Math.max(D.body.clientHeight, D.documentElement.clientHeight);
        else
            return slideElem.getBoundingClientRect().height;
    };
    
    function getDocWidth() {
        var D = document;
        //if(isWallpaperMode)
        //    return Math.max(D.body.clientWidth, D.documentElement.clientWidth);
        //else
            return slideElem.getBoundingClientRect().width;
    };

    function adjustImgSizeOnWinResize(){
        //if( !maintainAspectRatio ) return;
        if(isWallpaperMode){
            slideElem.style.height = getDocHeight() + 'px';
        //    slideElem.style.width = getDocHeight() + 'px';
        };
        var images = slideElem.getElementsByTagName( 'img' );
        var i = images.length -1;
        for( i; i >= 0; i-- ){
            (function( i ){
                var image = images[ i ];
                if(fitMode == 'Both'){
                    wallPaperMode(image);
                }else if(fitMode == 'Height'){
                    image.style.marginTop = - (image.height/2)  + 'px';
                    image.style.marginLeft = - (image.width/2)  + 'px';
                }else{
                    image.style.top = '50%';
                    image.style.marginTop = - (image.height/2)  + 'px';
                };
            })( i ); 
        };
    };
    
    function removeImageFromList( filename ){
        var i = 0;
        for( var i = loadingImageList.length-1; i >= 0; i-- ){
            (function(i){
                if( loadingImageList[ i ].src == filename ){
                    loadingImageList.splice(i, 1);
                    if( loadingImageList.length <= 0 ){
                        isLoading = false;
                    };
            		return;
                }
            })( i );
        };
    };
    
    function checkLoading(){
        if( !isLoading ){
            clearInterval( loadingTimer );
            imageLoaded( );
        };
    };
    
    function getFilename( param ){
        return param.substring( param.lastIndexOf("/") + 1 ).split( '.' )[0];
    };
    
    return {
        init: init,
        checkLoading: checkLoading,
        adjustImgSizeOnWinResize: adjustImgSizeOnWinResize,
        slideLeft: slideLeft,
        slideRight: slideRight
    };
};

