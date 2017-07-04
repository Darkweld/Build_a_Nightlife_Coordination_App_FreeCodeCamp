'use strict';

var mainUrl = "https://nightlife-coordination-app-darkweld.c9users.io"

var xhttp = {
   ready: function ready (fn) {
      document.addEventListener('DOMContentLoaded', fn, false);
   },
   request: function request (method, url, callback) {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
         }
      };

      xmlhttp.open(method, url, true);
      xmlhttp.send();
   }
};