/*jshint esversion: 6 */
global.jQuery = require("jquery");
global.$ = require("jquery");
require('bootstrap');
require('popper.js');

var uri = "https://prod-19.northeurope.logic.azure.com/workflows/6890be1a9c384658b836fefd7f38311d/triggers/manual/paths/invoke/desucon?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=9KNnfgr6FhBy4ujw2mhSw0hx8h_KdTTpLD1M_xPwza0";


$( document ).ready(function() {

    var content = "";

    $.ajax({
        url: uri,
        type: "GET",
        contentType:"application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            console.log(response);
            response.forEach(element => {
                content = content + createCard(element.TweetText, element.TweetedBy, element.CreatedAtIso, element.MediaUrls); 
            });

            $(".card-columns").html(content);

        }
    });
});

function createCard(text, user, time, image)
{
    var cardElementInit = "<div class='card tweet'>"; 

    if (image.length > 0)
    {
        cardElementInit += '<img class="card-img-top" src="' + image[0] + '" alt="Image"></img>';
    }

    return cardElementInit +
        '<div class="card-body">' +
            '<p class="card-text">' + text + '</p>' +
        '</div>' +
        '<div class="card-footer">' +
            '<small class="text-muted">' + user + ' - ' + (new Date(time)).toLocaleString() + '</small>' +
        '</div>' +
    '</div>';
}