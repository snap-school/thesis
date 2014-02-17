/*
* Load Bibliography from PLEIAD Site
*/

function load_bibtex(author){
    jQuery(document).ready(function(){
	var oJSBIB = new JSBib('http://pleiad.cl/b2/client/', data);
	var list;
	if(author=='all'){
	    list = oJSBIB.records;	
	}else{
	    list = oJSBIB.filterByUser(author);
	    if(list.length == 0) // not author, but software
		list = oJSBIB.filterBySoftware(author);
	}
	jQuery('#bibtex').replaceWith(oJSBIB.PPList(list));
	search();
    });
}

function search(){ 
    var url = window.location.toString(); 
    var pos = url.indexOf("?key=");
    if( pos > 0 ){
	var key = url.substring(pos + "?key=".length).replace(/-/,":");
	var obj = $("input[value='"+key+"']");
	if(obj){
	    ancestor = obj.parent().parent();
	    $('html, body').animate({
                scrollTop: ancestor.offset().top
	    }, 2000);
	    ancestor.css({backgroundColor: 'yellow'});
	}
    }
}

function bibtex(key){
    window.location = 'http://pleiad.cl/research/publications?key=' + key;
}
