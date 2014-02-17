
function correctPNG() 
// correctly handle PNG transparency in Win IE 5.5 or higher.
   {
   for(var i=0; i<document.images.length; i++)
      {
          var img = document.images[i]
          var imgName = img.src.toUpperCase()
          if (imgName.substring(imgName.length-3, imgName.length) == "PNG")
             {
                 var imgID = (img.id) ? "id='" + img.id + "' " : ""
                 var imgClass = (img.className) ? "class='" + img.className + "' " : ""
                 var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' "
                 var imgStyle = "display:inline-block;" + img.style.cssText
                 if (img.align == "left") imgStyle = "float:left;" + imgStyle
                 if (img.align == "right") imgStyle = "float:right;" + imgStyle
                 if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle               
                 var strNewHTML = "<span " + imgID + imgClass + imgTitle
                 + " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";"
             + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
                 + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>"
                 img.outerHTML = strNewHTML
                 i = i-1
             }
      }
   }


function change_headline(headline, pageGUID)
{
	var new_headline=prompt("Modification du titre:",headline)
	if (new_headline!=null && new_headline!="" && new_headline!=headline )
	    {
	    //window.location.replace("http://reddot.sgsi.ucl.ac.be:8080/bpcms/change_headline?headline=" + new_headline + "&" + params );	    
	    //window.location.replace("http://130.104.83.122:8988/bpcms/change_headline?headline=" + new_headline + "&" + params );
	    	    
	    document.change_headline_form.headline.value=new_headline;
	    document.change_headline_form.PG.value=pageGUID;	    
	    document.change_headline_form.redirect.value=document.location.href;
	    document.change_headline_form.submit();
	    }
}

function actionOnPage(action, pageGUID, headline)
{

	if ( action=="change_headline" ) 
	{
	 document.actionOnPage_form.action.value="change_headline";
	 var new_headline=prompt("Modification du titre:",headline)
	 if (new_headline!=null && new_headline!="" && new_headline!=headline )
	 {
	    document.actionOnPage_form.param1.value=new_headline;
	    document.actionOnPage_form.PG.value=pageGUID;	    
	    document.actionOnPage_form.redirect.value=document.location.href;
	    document.actionOnPage_form.submit();
	 }
	}
	else if ( action=="delete_page" ) 
	{
	 var r=confirm("Etes-vous certain de vouloir supprimer la page \"" + headline + "\" ?") ;
	 if (r==true)
		{
		document.actionOnPage_form.action.value="delete_page";
		document.actionOnPage_form.PG.value=pageGUID;
		document.actionOnPage_form.redirect.value=document.location.href;
		document.actionOnPage_form.submit();
		}
	}
}

function showhidediv(thedivid)
{
    theDiv=document.getElementById(thedivid);
    if (!(theDiv)) return false;
    if (theDiv.style.visibility == 'hidden')
    {
        theDiv.style.visibility='visible';
        theDiv.style.display='block';
    }
    else
    {
        theDiv.style.visibility='hidden';
        theDiv.style.display='none';
    }
    
}