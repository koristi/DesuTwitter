/*jshint esversion: 6 */

/*  ======================= SETUP ======================= */
var config = {
    trace: false,
    spiralResolution: 1, //Lower = better resolution
    spiralLimit: 360 * 5,
    lineHeight: 0.8,
    xWordPadding: 0,
    yWordPadding: 3,
    font: "Calibri"
};

var words;
var startPoint;
var cloud;
var wordsDown;
var mostFrequent = [];

function getMostFrequent(allWords)
{
    const arr1=allWords;
    let mf = 1;
    let m = 0;
    let item;
    for (let i=0; i<arr1.length; i++)
    {
            for (let j=i; j<arr1.length; j++)
            {
                    if (arr1[i] == arr1[j])
                     m++;
                    if (mf<=m)
                    {
                      mf=m; 
                      item = arr1[i];
                    }
            }
            m=0;
    }
    console.log(`${item} ( ${mf} times ) `) ;

    if (allWords.length > 0 && item != undefined && mostFrequent.length < 20)
    {
        mostFrequent.push(item);
        var newWords = allWords.filter(w => w != item);
        getMostFrequent(newWords);
    }
}

function drawMeACloud(allwords)
{
    getMostFrequent(allwords);
    
    words = mostFrequent.map(function(word) {
        return {
            word: word,
            freq: Math.floor((1-0.1*mostFrequent.indexOf(word)) * 50) + 10
        };
    });

    words.sort(function(a, b) {
        return -1 * (a.freq - b.freq);
    });

    cloud = document.getElementById('word-cloud');
    cloud.style.position = "relative";
    cloud.style.fontFamily = config.font;

    startPoint = {
        x: cloud.offsetWidth / 2,
        y: cloud.offsetHeight / 2
    };

    wordsDown = [];
    /* ======================= END SETUP ======================= */
}

/* =======================  PLACEMENT FUNCTIONS =======================  */
function createWordObject(word, freq) {
    var wordContainer = document.createElement("div");
    wordContainer.style.position = "absolute";
    wordContainer.style.fontSize = freq / 20 + "vw";
    wordContainer.style.lineHeight = config.lineHeight;
    wordContainer.appendChild(document.createTextNode(word));

    return wordContainer;
}

function placeWord(word, x, y) {

    cloud.appendChild(word);
    word.style.left = x - word.offsetWidth/2 + "px";
    word.style.top = y - word.offsetHeight/2 + "px";

    wordsDown.push(word.getBoundingClientRect());
}

function trace(x, y) {
//     traceCanvasCtx.lineTo(x, y);
//     traceCanvasCtx.stroke();
    //traceCanvasCtx.fillRect(x, y, 1, 1);
}

function spiral(i, callback) {
    angle = config.spiralResolution * i;
    x = (1 + angle) * Math.cos(angle);
    y = (1 + angle) * Math.sin(angle);
    return callback ? callback() : null;
}

function intersect(word, x, y) {
    cloud.appendChild(word);    
    
    word.style.left = x - word.offsetWidth/2 + "px";
    word.style.top = y - word.offsetHeight/2 + "px";
    
    var currentWord = word.getBoundingClientRect();
    
    cloud.removeChild(word);
    
    for(var i = 0; i < wordsDown.length; i+=1){
        var comparisonWord = wordsDown[i];
        
        if(!(currentWord.right + config.xWordPadding < comparisonWord.left - config.xWordPadding ||
             currentWord.left - config.xWordPadding > comparisonWord.right + config.wXordPadding ||
             currentWord.bottom + config.yWordPadding < comparisonWord.top - config.yWordPadding ||
             currentWord.top - config.yWordPadding > comparisonWord.bottom + config.yWordPadding)){
            
            return true;
        }
    }
    
    return false;
}
/* =======================  END PLACEMENT FUNCTIONS =======================  */





/* =======================  LETS GO! =======================  */
function placeWords() {
    for (var i = 0; i < words.length; i += 1) {

        var word = createWordObject(words[i].word, words[i].freq);

        for (var j = 0; j < config.spiralLimit; j++) {
            //If the spiral function returns true, we've placed the word down and can break from the j loop
            if (spiral(j, function() {
                    if (!intersect(word, startPoint.x + x, startPoint.y + y)) {
                        placeWord(word, startPoint.x + x, startPoint.y + y);
                        return true;
                    }
                })) {
                break;
            }
        }
    }
}