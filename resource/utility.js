window.addEventListener('load', function(e){
	utility.init( function(){
		console.log( "initialize utility js." );
	});
});
window.addEventListener('orientationchange', function(e){
	utility.orientationchange( );
});
window.addEventListener('resize',function(e){
    utility.windowResize( );
});

var utility = (function( ){
	
	var keys = {37: 1, 38: 1, 39: 1, 40: 1};
	var initFunc = [];
	var orientFunc = [];
    var winResizeFunc = [];
    var _winResizeTimer = -1;

	function init( param ){
		if( param )  param( );
		var i = initFunc.length -1;
        for( i; i >=0; i-- ){
            (function(i){
                initFunc[ i ]();
            })(i); 
        };
		delete initFunc;
        
        window.requestAnimationFrame = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || 
            window.msRequestAnimationFrame;
	};

	function orientationchange( param ){
		if( param ) param( );
        if( orientFunc.length > 0 ){
            var i = orientFunc.length -1;
            for( i; i >=0; i-- ){
                (function(i){
                    orientFunc[ i ]();
                })(i); 
            };
        };
	};
    
     function windowResize( param ){
		if( param ) param( );
         if( winResizeFunc.length > 0 ){
            var i = winResizeFunc.length -1;
            for( i; i >=0; i-- ){
                (function(i){
                    winResizeFunc[ i ]();
                })(i); 
            };
         };
	};

	function getPageDimentions( ){
		return (window.innerHeight > window.innerWidth) ?
			{ width: screen.width, height: screen.height } :
			{ width: screen.height, height: screen.width };
	};
	
	function preventDefault(e) {
	  e = e || window.event;
	  if (e.preventDefault)
	      e.preventDefault();
	  e.returnValue = false; 
	};

	function preventDefaultForScrollKeys(e) {
	    if (keys[e.keyCode]) {
	        utility.preventDefault(e);
	        return false;
	    }
	};

	function disableScroll() {
	  if (window.addEventListener) // older FF
	      window.addEventListener('DOMMouseScroll', utility.preventDefault, false);
	  window.onwheel = utility.preventDefault; // modern standard
	  window.onmousewheel = document.onmousewheel = utility.preventDefault; // older browsers, IE
	  window.ontouchmove  = utility.preventDefault(); // mobile
	  document.onkeydown  = utility.preventDefaultForScrollKeys;
	};

	function enableScroll() {
	    if (window.removeEventListener)
	        window.removeEventListener('DOMMouseScroll', utility.preventDefault, false);
	    window.onmousewheel = document.onmousewheel = null; 
	    window.onwheel = null; 
	    window.ontouchmove = null;  
	    document.onkeydown = null;  
	};
	
	function getParent( obj, node ){
		if( obj.parentElement.nodeName === 'HTML' )
			return null;
		
		if( obj.parentElement.nodeName === node )
			return obj.parentElement;
		else
			return getParent( obj.parentElement, node );
	};

	function getURLParameter( name ){
		var url = location.href;
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( url );
		return results == null ? null : results[1];
	};
	
	function onPageLoad( param ){
		initFunc.push( param );
	};

	function onOrientationChange( param ){
		orientFunc.push( param );
	};
    
    function onWindowResize( param ){
		winResizeFunc.push(param);
	};
    
    function isTouchDevice() {
     return (('ontouchstart' in window)
          || (navigator.MaxTouchPoints > 0)
          || (navigator.msMaxTouchPoints > 0));
    };

	function getPageOrientation( ){
		switch(window.orientation) {  
	      case -90:
	      case 90:
	        return 'landscape';
	        break; 
	      default:
	        return 'portrait';
	        break; 
	    };
	};
    
    function toJSON( param ){
      return JSON.parse(param.replace(/'/g, '"'));
    };
    
    function execStringFunction( param ){
     	var parts = param.split( '.' );
        var txtFunction = window;
        var i = 0, j = parts.length - 1;
        for( i; i <= j; i++ ){
            txtFunction = txtFunction[ parts[ i ] ];
        };
        if( typeof txtFunction == 'function' ){
            txtFunction();
        };
    };
	
	return {
		init: init,
        isTouchDevice: isTouchDevice,
        windowResize: windowResize,
        execStringFunction: execStringFunction,
        onWindowResize: onWindowResize,
		getPageOrientation: getPageOrientation,
		onOrientationChange: onOrientationChange,
		orientationchange: orientationchange,
		getPageDimentions: getPageDimentions,
		getURLParameter: getURLParameter,
		preventDefault: preventDefault,
		preventDefaultForScrollKeys: preventDefaultForScrollKeys,
		getParent: getParent,
		onPageLoad: onPageLoad,
		disableScroll: disableScroll,
		enableScroll: enableScroll,
        toJSON: toJSON
	};
	
})( );