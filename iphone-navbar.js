HTMLNavigationBar : {
    
     TITLE_LIMIT : 65, //percent
     BTN_RIGHT_MARGIN : 14, //pixel
     BTN_LEFT_MARGIN : 6, //pixel
     
     listener: function(){Bk.HTMLNavigationBar.positionElements(Bk.event.BK_PAGE_LOADED)},
     
     positionElements : function(e) {
        if(e === Bk.event.BK_PAGE_LOADED){
            Bk.event.removeListener(Bk.event.BK_PAGE_LOADED, window, Bk.HTMLNavigationBar.listener);
            Bk.event.addListener(Bk.event.BK_HEADER_LOADED, window, function(){Bk.HTMLNavigationBar.positionElements(Bk.event.BK_HEADER_LOADED)});
        }    
        
        var bkHeader = document.getElementById("bk-header");
        
        if(!bkHeader){
            Bk.log.info("No headder was found");
            return;
        }
        
        var navBar = Bk.HTMLNavigationBar.getNavBar(bkHeader);
        
        if(!navBar){
            Bk.log.info("No div with bk-role = navbar found");
            return;
        }
        
        var h1 = navBar.getElementsByTagName("h1")[0];
        var arrowSpan = navBar.getElementsByTagName("span")[0];
        
        if(!arrowSpan){
            Bk.log.info("No button was found in Nav Bar");
            return;
        }
        
        var arrowWidth = arrowSpan.clientWidth - 11; //11px because <a> tag overlaps the arrow.
        var a = navBar.getElementsByTagName("a")[0];

        var h1RealWidth = Bk.HTMLNavigationBar.getRealWidth(h1);
    
        var title_maxSize = navBar.clientWidth * Bk.HTMLNavigationBar.TITLE_LIMIT / 100;
        
        var anchorMaxLimitInPercent = window.getComputedStyle(a,null).getPropertyValue("max-width"); //42%
        var anchorMaxLimit = anchorMaxLimitInPercent.substr(0, anchorMaxLimitInPercent.length - 1); //42
        var anchorMaxSize = navBar.clientWidth * anchorMaxLimit / 100;
        
        //button padding
       var buttonPaddingRightInPixel =  window.getComputedStyle(a,null).getPropertyValue("padding-right"); 
       var buttonPaddingLeftInPixel =  window.getComputedStyle(a,null).getPropertyValue("padding-left"); 
       
       var buttonPaddingRight =  buttonPaddingRightInPixel.substr(0, buttonPaddingRightInPixel.length - 2);
       var buttonPaddingLeft =  buttonPaddingLeftInPixel.substr(0, buttonPaddingLeftInPixel.length - 2);
       
       var totalButtonPadding =  parseInt(buttonPaddingRight, 10) + parseInt(buttonPaddingLeft, 10);
       
       var btnContainerWidth = Bk.HTMLNavigationBar.BTN_LEFT_MARGIN + arrowWidth + a.clientWidth + totalButtonPadding + Bk.HTMLNavigationBar.BTN_RIGHT_MARGIN;
       if(h1RealWidth > title_maxSize){
            if(btnContainerWidth > navBar.clientWidth - title_maxSize){
               
                h1.style.setProperty("width", title_maxSize + "px", null);
                
                var anchorWidth = navBar.clientWidth - title_maxSize - Bk.HTMLNavigationBar.BTN_LEFT_MARGIN - arrowWidth - totalButtonPadding - Bk.HTMLNavigationBar.BTN_RIGHT_MARGIN;  
                a.style.setProperty("max-width", anchorWidth + "px", null);
                
                var marginLeft = navBar.clientWidth - title_maxSize;
                h1.style.setProperty("margin-left", marginLeft + "px", null);
                h1.style.setProperty("text-align", "left", null);
                
            }else{
                var availableExtraFreeSpace = navBar.clientWidth - title_maxSize - btnContainerWidth; 
                var h1Width = title_maxSize + availableExtraFreeSpace;
                h1.style.setProperty("width", h1Width + "px", null);
                
                var marginLeft =  btnContainerWidth;
                h1.style.setProperty("margin-left", marginLeft + "px", null);
                h1.style.setProperty("text-align", "left", null);             
            }
            
        }else if (h1RealWidth < title_maxSize && h1RealWidth > (navBar.clientWidth - anchorMaxSize)){
            //Don't change <h1> width 
        	//iPhone prioritizes <h1> over the button
        	
            var anchorWidth = navBar.clientWidth - h1RealWidth - Bk.HTMLNavigationBar.BTN_LEFT_MARGIN - arrowWidth - totalButtonPadding - Bk.HTMLNavigationBar.BTN_RIGHT_MARGIN;  
            a.style.setProperty("max-width", anchorWidth + "px", null);
    
            if(Bk.HTMLNavigationBar.isTitleCentrable(arrowWidth, a.clientWidth, totalButtonPadding, h1RealWidth, navBar.clientWidth)){
            	return;
            }
            
            var marginLeft = navBar.clientWidth - h1RealWidth;
            
            //In wide screens, add a little space at the right side of <h1>  
            if(btnContainerWidth < marginLeft){
            	var diff = marginLeft - btnContainerWidth;
            	if(diff > 7){
            		marginLeft = marginLeft - 7;
            	}else {
            		marginLeft = marginLeft - (diff/2); 
            	}
            }else{
            	h1.style.setProperty("padding-right", 1 + "px", null);
            }
            
            
            h1.style.setProperty("margin-left", marginLeft + "px", null);
            h1.style.setProperty("text-align", "left", null);
            
        }else{
            //Use CSS max-width on the <a>
            if(! Bk.HTMLNavigationBar.isTitleCentrable(arrowWidth, a.clientWidth, totalButtonPadding, h1RealWidth, navBar.clientWidth)){
                var marginLeft = Bk.HTMLNavigationBar.BTN_LEFT_MARGIN + arrowWidth + a.clientWidth + totalButtonPadding + Bk.HTMLNavigationBar.BTN_RIGHT_MARGIN;
                h1.style.setProperty("margin-left", marginLeft + "px", null);
                h1.style.setProperty("text-align", "left", null);             
            }
        }       
    },

    isTitleCentrable : function (arrowWidth, anchorWidth, totalButtonPadding, h1Width, navBarWidth){
        var res = (navBarWidth / 2) > (Bk.HTMLNavigationBar.BTN_LEFT_MARGIN + arrowWidth + anchorWidth + totalButtonPadding + Bk.HTMLNavigationBar.BTN_RIGHT_MARGIN + (h1Width/2));
        return res;
    },

    getRealWidth : function (h1) {
        h1.style.setProperty("display", "inline-block", null);
        var width = h1.clientWidth;
        h1.style.setProperty("display", "block", null);
        return width;
    },
    
    getNavBar : function (bkHeader){
        var divElements =  bkHeader.getElementsByTagName("div");
        for(var i = 0; i < divElements.length; i++ ){
            if(divElements[i].getAttribute("data-bk-role") == "navbar"){
                return divElements[i];
            }
        }
        return null;
    }
}
