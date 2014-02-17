//
// Helpers
//
function href(href, text, target, hclaz){
	var hclass =  (hclass ? ' class=\"' + hclaz + '\"' : '');
	var htarget = (target ? ' target="' + target + '"' : '');
    return '<a href="' + href + '"' + hclass + htarget +'>' + text + '</a>';
}

var months = {};months['jan'] = 'January';months['feb'] = 'February';months['mar'] = 'March';months['apr'] = 'April';months['may'] = 'May';months['jun'] = 'June';months['jul'] = 'July';months['aug'] = 'August';months['sep'] = 'September';months['oct'] = 'October';months['nov'] = 'November';months['dec'] = 'December';

function getMonth(m){
    if(m in months) return months[m];
    return m.substring(0,1).toUpperCase() + m.substring(1);
}

//
// JSBib prototype
//
var JSBib = function(prefix, r){
    this.records = r.records;
    this.prefix = prefix;
}

JSBib.prototype.filterBy = function(filterTest){
    var l = this.records.length;
    var list = [];
    for (var i = 0; i < l; i++) {
	var entry = this.records[i];
	if(filterTest(entry)){
	    list.push(entry);
	}
    }
    return list;
};

JSBib.prototype.filterByAuthorName = function(authorName){   
    return this.filterBy(function(e){
	if(e.author){
	    var l = e.author.length;
	    for(var i = 0; i < l; i++){
		if(e.author[i].name === authorName){
		    return true;
		}
	    }
	}
	return false;
    });
};

JSBib.prototype.filterByUser = function(userName){   
    return this.filterBy(function(e){
	if(e.users){
	    if(e.users.search(userName) >= 0){
		return true;
	    }	    
	}
	return false;
    });
};

JSBib.prototype.filterBySoftware = function(softwareName){   
    return this.filterBy(function(e){
	if(e.software){
	    if(e.software === softwareName){
		    return true;
	    }
	}
	return false;
    });
};

JSBib.prototype.PPAuthor = function(author, short){
    var s = '<div class=\'jsbib-authors\'>';
	var l = Array();
	for(var i = 0; i < author.length; i++){
	    x = author[i].name.split(',')
	    if(short){
	    	l.push(x[1].substring(0, 2) + '. ' + x[0]);	    
		} else {
			l.push(x[1] + ' ' + x[0]);	
		}
	}
	s += l.join(', ');
    s += '</div>';    
    return s;
}

JSBib.prototype.PPTitle = function(title){
	var s = '';
	s += '<div class=\'jsbib-title\'>';
	s += title;
	s += '</div>';
	return s;
}

JSBib.prototype.PPInfo = function(e){
    var s = "";
    var l = Array();	
    s += '<div class=\'jsbib-info\'>';
    
    // published at
    if(e.booktitle) l.push(e.booktitle);
    if(e.journal) l.push(e.journal.name);

    // published at info
    if(e.volume) l.push('volume ' + e.volume);
    if(e.number) l.push('number ' + e.number);
    // published pages	
    if(e.pages) l.push('pp.' + e.pages.split(" to ").join("-"));
    // location
    if(e.location) l.push(e.location);
    else if(e.address) l.push(e.address);
    // published when
    if(e.year){ 
    	if(e.month) l.push(getMonth(e.month) + ' ' + e.year); 
	else l.push(e.year); 
    }
    // publisher
    if(e.publisher) l.push(e.publisher);
    if(e.school) l.push(e.school);
    if(e.institution) l.push(e.institution);

    // publication type enhancers
    if(e.type.toLowerCase() == 'phdthesis') l.push("(PhD Thesis)");
    
    s += l.join(', ');   
    s += '</div>';
    return s;
}

JSBib.prototype.PPNote = function(note){
	var s = '';
	s += '<div class=\'jsbib-note\'>';
	s += note;
	s += '</div>'
	return s;
}

JSBib.prototype.PPWebNote = function(webnote){
	var s = '';
	s += '<div class=\'jsbib-webnote\'>';
	s += webnote
	s += '</div>'
	return s;
}

JSBib.prototype.PPid = function(id){
	return '<input type="hidden" name=\'id\' value='+ id + ' />';
}

JSBib.prototype.PPurls = function(e){
	var s = '';
	s += '<div class=\'jsbib-links\'>';
	var l = Array();
	if(e.urlbib) l.push(this.PPurlBib(e.urlbib));
	if(e.urldoi) l.push(this.PPurlDoi(e.urldoi));
	if(e.urlpdf) l.push(this.PPurlPdf(e.urlpdf));

	if (l.length > 0)
		s += '[' + l.join(', ') + ']';
	s += '</div>'
	return s;
}

JSBib.prototype.PPurlBib = function(url){
	return href(this.prefix + 'all/' + url,'bib', '_blank');
}

JSBib.prototype.PPurlDoi = function(url){
	return href(url,'doi', '_blank');
}

JSBib.prototype.PPurlPdf = function(url){
	return href(url,'pdf', '_blank');
}

JSBib.prototype.PPEntry = function(e){
    var s = "";	
    s += '<div class=\'jsbib-entry\'>';
    if(e.id) s += this.PPid(e.id);			
    s += this.PPurls(e);    	
    if(e.title) s += this.PPTitle(e.title);
    if(e.author) s += this.PPAuthor(e.author);
    else if(e.editor) s += this.PPAuthor(e.editor);
    s += this.PPInfo(e);
    if(e.note) s += this.PPNote(e.note);
    if(e.webnote) s += this.PPWebNote(e.webnote);
    //    s += '<hr style="clear: both;"/>';
    s += '</div>';
    return s;
};

JSBib.prototype.PPList = function(elist){

    elist.sort(function(e1, e2){ 
    	if(e1.year == e2.year){
	    var x = e1.title[0].toLowerCase(), y = e2.title[0].toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
	}
	return e2.year - e1.year;
    });
    
    var l = elist.length;
    var s = '<div class=\'jsbib-list\'>';
    
    var yearHasChanged = true;
    var currentYear = null;
    var oldYear = null;
    var realYear = new Date().getFullYear();

    for(var i = 0; i < l; i++){	
	oldYear = currentYear;
	currentYear = elist[i].year;
	
	if(currentYear !== oldYear){
	    if(oldYear != null){
		s += '</div>'; // close previous div
	    }
	    
	    // write currentYear
	    s += '<div class=\'jsbib-year\'>';		    
	    s += '<h1>' + (currentYear > realYear ? 'To Appear' : currentYear) + '</h1><p/>&nbsp;';
	}
	
	s += '<div class="jsbib-group">'
	//s += '<div class=\'jsbib-number\'>[' + (l-i) + ']&nbsp;</div>';		
	s += this.PPEntry(elist[i]);	
	s += '</div>'
    }

    s += '</div>';
    s += '</div>';
    return s;
};
