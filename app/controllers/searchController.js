'use strict';

(function() {
    var form = document.getElementById('searchForm');
    var search = document.getElementById('Search');
    var nightlife = document.getElementById('nightlife');
    var pagination = document.getElementById('pagination');
    var loader = document.getElementById('loader');
    
    search.focus();

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        nightlife.classList.add("displayNone");
        pagination.classList.add("displayNone");
        loader.classList.remove("displayNone");

        var searchUrl = mainUrl + "/search/" + search.value;

        xhttp.request('POST', searchUrl, function(data) {
            var businessObj = JSON.parse(data);

            if (businessObj.error) {
                return function() {
                    console.log("true");
                    nightlife.innerHTML = "";
                    pagination.innerHTML = "";

                    var errorh1 = document.createElement("h1");
                    var errorh1Text = document.createTextNode("Error: " + businessObj.error);
                    errorh1.className = "error";
                    errorh1.appendChild(errorh1Text);
                    nightlife.appendChild(errorh1);


                    loader.classList.add("displayNone");
                    nightlife.classList.remove("displayNone");
                    pagination.classList.remove("displayNone");
                }();
            }
            nightlife.innerHTML = "";
            pagination.innerHTML = "";


            (function() {
                var businessArray = [];
                return new Promise(function(resolve, reject) {
                    var num = 0;
                    var arr = [];
                    for (var i = 0, l = businessObj.length; i < l; i++) {
                        arr[num] = businessObj[i];
                        num++;
                        if (num === 10 || i === l - 1) {
                            businessArray.push(arr);
                            arr = [];
                            num = 0;
                        }
                    }
                    console.log(businessArray);
                    resolve(businessArray);
                }).then(function(value) {

                    for (var i = 0, leni = value.length; i < leni; i++) {

                        (function() {
                            var link = document.createElement("a");
                            var linktext = document.createTextNode(i + 1);
                            link.className = "mainLink";
                            link.appendChild(linktext);

                            pagination.appendChild(link);

                            var bigDiv = document.createElement("div");
                            bigDiv.className = "nightlife-bigDiv";

                            for (var j = 0, lenj = value[i].length; j < lenj; j++) {


                                var div = document.createElement("div");
                                div.className = "nightlife-div";

                                var img = document.createElement('img');
                                img.src = value[i][j].businessImageUrl;
                                img.className = "nightlife-img";
                                div.appendChild(img);

                                var name = document.createElement("p");
                                var nametext = document.createTextNode(value[i][j].businessName);
                                name.className = "businessName";
                                name.appendChild(nametext);
                                div.appendChild(name);

                                var busLink = document.createElement("a");
                                var busLinkText = document.createTextNode("Visit yelp page");
                                busLink.href = value[i][j].businessYelpUrl;
                                busLink.className = "yelpUrl";
                                busLink.target = "_blank";
                                busLink.appendChild(busLinkText);
                                div.appendChild(busLink);

                                var numberGoing = document.createElement("p");
                                var numberGoingText = document.createTextNode("Visitors: " + value[i][j].numberGoing);
                                numberGoing.id = j + 1;
                                numberGoing.className = "visitorNum";
                                numberGoing.appendChild(numberGoingText);
                                div.appendChild(numberGoing);

                                var mongodLink = document.createElement("a");
                                var mongodLinktext = document.createTextNode("Add/Remove RSVP");
                                mongodLink.className = "goingUrl";
                                mongodLink.appendChild(mongodLinktext);
                                div.appendChild(mongodLink);

                                (function(current, num) {
                                    mongodLink.addEventListener('click', function(event) {

                                        xhttp.request("POST", mainUrl + "/business/" + current.businessID, function(doc) {
                                            if (isNaN(doc)) {
                                                return window.location.replace(mainUrl + "/login");
                                            }

                                            document.getElementById(num).textContent = "Visitors: " + doc;
                                        });

                                    }, false);

                                })(value[i][j], j + 1);

                                bigDiv.appendChild(div);

                            }

                            link.addEventListener('click', function(event) {
                                var element = document.querySelectorAll(".mainLink");
                                for (var i = 0, j = element.length; i < j; i++) {
                                    element[i].classList.remove("current");
                                }
                                event.currentTarget.className += " current";
                                nightlife.innerHTML = "";
                                nightlife.appendChild(bigDiv);
                            }, false);

                            if (i === 0) link.click();

                        })();

                    }
                    loader.classList.add("displayNone");
                    nightlife.classList.remove("displayNone");
                    pagination.classList.remove("displayNone");

                }).catch(function(error) {
                    console.log(error);
                });

            })();

        }, false);


    });

})();