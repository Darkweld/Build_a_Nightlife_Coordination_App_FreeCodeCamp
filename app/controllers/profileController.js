'use strict';


(function() {
    
    var recieveprofileUrl = mainUrl + "/getUser";
    var github = document.querySelector(".github-profile");
    var google = document.querySelector(".google-profile");
    var twitter = document.querySelector(".twitter-profile");
    var facebook = document.querySelector(".facebook-profile");
    
    xhttp.ready(xhttp.request("GET", recieveprofileUrl, function(data){
        var userObject = JSON.parse(data);
        
        for (var i in userObject.tokens) {
            var capital = i.substr(0,1).toUpperCase() + i.substr(1, i.length);
            document.querySelector("#" + i).href = mainUrl + "/unlink/" + i;
            document.querySelector("#" + i + "-text").innerHTML = "Unlink " + capital;
        }
        
        
        
        
    }));
    
    
    
    
    
    
    
    
    
    
    
})();