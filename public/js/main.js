/*jshint esversion: 6 */
global.jQuery = require("jquery");
global.$ = require("jquery");
require('bootstrap');
require('popper.js');

var getTweetsUri = "https://prod-19.northeurope.logic.azure.com/workflows/" + 
    "6890be1a9c384658b836fefd7f38311d/triggers/manual/paths/invoke/desucon" + 
    "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=9KNnfgr6FhBy4ujw2mhSw0hx8h_KdTTpLD1M_xPwza0";
var getTweetDataUri = "https://prod-28.northeurope.logic.azure.com/workflows/" + 
    "fa9c0a3b26304b6c8ce04a06de25cbde/triggers/manual/paths/invoke/tweets" + 
    "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=KiSu4ob7IqBHqjboZqfOJ5b78mwzKXBrmqv3FOosucM";

$( document ).ready(function() {

    var content = "";

/*     $.ajax({
        url: getTweetsUri,
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
    }); */

    $.ajax({
        url: getTweetDataUri,
        type: "GET",
        contentType:"application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            console.log(response);
            drawCountPerPerson(response);
            drawCountPerDate(response);
            drawCountPerHour(response);
            getAllWords(response);
        }
    });
});

function createCard(text, user, time, image) {
    var cardElementInit = "<div class='card'>"; 

    if (image.length > 0)
    {
        cardElementInit += '<img class="card-img-top" src="' + image[0] + '" alt="Image"></img>';
    }

    return cardElementInit +
        '<div class="card-body">' +
            '<p class="card-text">' + text + '</p>' +
        '</div>' +
        '<div class="card-footer">' +
            '<small class="text-muted"><a href="https://twitter.com/' + user + '">' + 
            user + '</a> - ' + (new Date(time)).toLocaleString() + '</small>' +
        '</div>' +
    '</div>';
}

function drawCountPerPerson(response) {
    var chart = echarts.init(document.getElementById('countChart'));

    var perUserArray = [];
    var tweetCounts = [];
    var users = [];
    
    response.forEach(tweet => {

        if (tweetCounts[tweet.User] != null)
        {
            tweetCounts[tweet.User] += 1;
        }
        else
        {
            tweetCounts[tweet.User] = 1;
        }

        if (!users.includes(tweet.User))
        {
            users.push(tweet.User);
        }
    });

    users.forEach(username => {
        perUserArray.push({value: [username, tweetCounts[username]]});
    });

    console.log(perUserArray);

    var option = {
        title: {
            text: 'Tweets Per User'
        },
        color: 'green',
        xAxis: {
            type: 'category'
        },
        yAxis: {
            type: 'value',
            minInterval: 1
        },
        series: {
            type: 'bar',
            data: perUserArray
        }
    };

    chart.setOption(option);
}

function drawCountPerDate(response) {
    var chart = echarts.init(document.getElementById('dateChart'));

    var perDateArray = [];
    var tweetCounts = [];
    var dates = [];
    
    response.forEach(tweet => {

        var y = new Date(tweet.Created).getFullYear();
        var m = new Date(tweet.Created).getMonth();
        var d = new Date(tweet.Created).getDate();
        var valueAsDate = new Date(y,m,d);

        if (tweetCounts[valueAsDate.toLocaleDateString()] != null)
        {
            tweetCounts[valueAsDate.toLocaleDateString()] += 1;
        }
        else
        {
            tweetCounts[valueAsDate.toLocaleDateString()] = 1;
        }

        if (!dates.includes(valueAsDate.toLocaleDateString()))
        {
            dates.push(valueAsDate.toLocaleDateString());
        }
    });

    dates.forEach(date => {
        perDateArray.push({value: [date, tweetCounts[date]]});
    });

    console.log(perDateArray);

    var option = {
        title: {
            text: 'Tweets Per Date'
        },
        color: 'green',
        xAxis: {
            type: 'category'
        },
        yAxis: {
            type: 'value',
            minInterval: 1
        },
        series: {
            type: 'bar',
            data: perDateArray
        }
    };

    chart.setOption(option);
}

function drawCountPerHour(response) {
    var chart = echarts.init(document.getElementById('hourChart'));

    var perHourArray = [];
    var tweetCounts = [];
    var hours = [];
    
    response.forEach(tweet => {

        var y = new Date(tweet.Created).getFullYear();
        var m = new Date(tweet.Created).getMonth();
        var d = new Date(tweet.Created).getDate();
        var h = new Date(tweet.Created).getHours();
        var valueAsDate = new Date(y,m,d,h);

        if (tweetCounts[valueAsDate.toLocaleString()] != null)
        {
            tweetCounts[valueAsDate.toLocaleString()] += 1;
        }
        else
        {
            tweetCounts[valueAsDate.toLocaleString()] = 1;
        }

        if (!hours.includes(valueAsDate.toLocaleString()))
        {
            hours.push(valueAsDate.toLocaleString());
        }
    });

    hours.forEach(date => {
        perHourArray.push({value: [date, tweetCounts[date]]});
    });

    console.log(perHourArray);

    var option = {
        title: {
            text: 'Tweets Per Hour'
        },
        color: 'green',
        xAxis: {
            type: 'category'
        },
        yAxis: {
            type: 'value',
            minInterval: 1
        },
        series: {
            type: 'bar',
            data: perHourArray
        }
    };

    chart.setOption(option);
}

function getAllWords(response)
{
    var arrayOfWords = [];
    response.forEach(tweet => {
        arrayOfWords = arrayOfWords.concat(tweet.Text.split(' '));
    });

    drawMeACloud(arrayOfWords);
    placeWords();
}