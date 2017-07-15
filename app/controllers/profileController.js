'use strict';


(function() {

    var recieveprofileUrl = mainUrl + "/getUser";
    var businessProfile = document.querySelector(".visiting");

    xhttp.ready(xhttp.request("GET", recieveprofileUrl, function(data) {
        var userObject = JSON.parse(data);

        for (var i in userObject.tokens) {
            var capital = i.substr(0, 1).toUpperCase() + i.substr(1, i.length);
            document.querySelector("#" + i).href = mainUrl + "/unlink/" + i;
            document.querySelector("#" + i + "-text").innerHTML = "Unlink " + capital;
        }
        var not = document.createElement("p");
        var notText = document.createTextNode("You are not visiting any locations.");
        not.className = "businessName";
        not.appendChild(notText);

        (function() {
            if (userObject.visiting.length) {
                var title = document.createElement("p");
                var titleText = document.createTextNode("Locations:");
                title.className = "businessName";
                title.appendChild(titleText);
                businessProfile.appendChild(title);

                for (var j = 0, l = userObject.visiting.length; j < l; j++) {

                    var div = document.createElement("div");
                    div.className = "nightlife-div";

                    var img = document.createElement('img');
                    img.src = userObject.visiting[j].businessImageUrl;
                    img.className = "nightlife-img";
                    div.appendChild(img);

                    var name = document.createElement("p");
                    var nametext = document.createTextNode(userObject.visiting[j].businessName);
                    name.className = "businessName";
                    name.appendChild(nametext);
                    div.appendChild(name);

                    var busLink = document.createElement("a");
                    var busLinkText = document.createTextNode("Visit yelp page");
                    busLink.href = userObject.visiting[j].businessYelpUrl;
                    busLink.className = "yelpUrl";
                    busLink.target = "_blank";
                    busLink.appendChild(busLinkText);
                    div.appendChild(busLink);

                    var mongodLink = document.createElement("a");
                    var mongodLinktext = document.createTextNode("Remove RSVP");
                    mongodLink.className = "goingUrl";
                    mongodLink.appendChild(mongodLinktext);
                    div.appendChild(mongodLink);

                    (function(currentdiv, currentID) {
                        mongodLink.addEventListener("click", function(event) {

                            xhttp.request("POST", mainUrl + "/business/" + currentID, function(doc) {
                                businessProfile.removeChild(currentdiv);
                                if (businessProfile.children.length === 1) businessProfile.removeChild(title), businessProfile.appendChild(not);
                            });
                        }, false);
                    })(div, userObject.visiting[j].businessID);

                    businessProfile.appendChild(div);

                }

            } else {
                businessProfile.appendChild(not);
            }

        })();




    }));




})();