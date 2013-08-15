/*
 * For reading/writing files.
 */
var fs = require("fs");

/**
 * Generates a random terrain based on the seedFile and the relationData given
 * as inputs.
 *
 * @param {string} `seedFile`       The file path to the seed file.
 * @param {object} `data`           Formatted object that specifies which 
 *                                  characters are to be used and the 
 *                                  relationships that govern their patterns. 
 *                                  For each character, `x`, `data` must 
 *                                  contain a function named simply as that 
 *                                  character, and it must return the 
 *                                  probability of that character appearing 
 *                                  given the characters to the west, north-
 *                                  west, north, and north-east. The function 
 *                                  must also be able to handle undefined 
 *                                  values for the above directions.
 * @param {string} `destinaionFile` The file to write out to.
 * @param {int} `height`            The number of horizontal lines of the map.
 * @param {int} `width`             Number of characters in a horizontal line.
 */
var generateFromSeed = function(seedFile, destinationFile, data, height, width) {
    
    var alphabet = [];
    // Add alphabet characters
    for (var ch in data) {
      alphabet.push(ch);
    }
    
    // Read in the seedFile
    var rawInString = fs.readFileSync(seedFile, 'utf8');
    
    // Decompose it into an array of strings (where each string is a line in the file)
    var grid = [];
    var row = col = 0;
    for (var i = 0; i < rawInString.length; i++) {
        var c = rawInString[i];
        if (c === '\r\n') {
            row++;
            col = 0;
        }
        else {
            
            if (typeof grid[row] === 'undefined') {
                grid[row] = [];
            }
            
            grid[row][col++] = c;
        }
    }
    
    var rawOutString = '';
    
    for (var i = 0; i < height; i++) {
    
        if (typeof grid[i] === 'undefined') {
            grid[i] = [];
        }
    
        for (var j = 0; j < width; j++) {
            
            var c = grid[i][j];
            
            // If this spot is NOT taken, write in a new value
            // If it IS take, continue on wih the loop
            if (typeof c === 'undefined') {
                
                var west, northwest, north, northeast;
                
                if (j > 0) {
                    west = grid[i][j - 1];
                }
                
                if (i > 0) {
                    northwest = grid[i - 1][j - 1];
                    north = grid[i - 1][j];
                    northeast = grid[i - 1][j + 1];
                }                    
                
                var probabilities = [];
                
                for (var idx in alphabet) {
                    // probability of alphabet[idx] occuring next given W, NW, N, NE
                    probabilities[idx] = {probability: data[alphabet[idx]](west, northwest, north, northeast), id: idx};
                }
               
                // Normalize the probabilities
                probabilities = normalize(probabilities);
                
                //console.log(alphabet);
                //console.log(probabilities);
                
                var diceRoll = Math.random();
                
                // Check what value the diceRoll qualifies for
                for (var idx in probabilities) {
                
                    if (diceRoll <= probabilities[idx].probability) {
                    
                        grid[i][j] = alphabet[probabilities[idx].id];
                        rawOutString += alphabet[probabilities[idx].id];                        
                        break;
                    }
                }
            }
            else {
                grid[i][j] = c;
                rawOutString += c;
            }
        }
        
        rawOutString += "\r\n";
    }
    
    fs.writeFile(destinationFile, rawOutString, function (err) {
        if (err) {
            throw err;
        }
    });
    
}


var polarData = {
    '.': function(w, nw, n, ne) { // SHORT GRASS
        var P = 0;
        
        if ('`' === nw) P += .01;
        if ('`' === n)  P += .01;
        if ('`' === ne) P += .01;
        
        if ('.' === w)  P += .15;
        if ('.' === nw) P += .15;
        if ('.' === n)  P += .15;
        if ('.' === ne) P += .15;
        
        if (',' === w)  P += .10;
        if (',' === nw) P += .10;
        if (',' === n)  P += .10;
        if (',' === ne) P += .10;
        
        return P;
    },
    '`': function(w, nw, n, ne) { // SNOW
        var P = 0;
        
        if ('`' === w)  P += .30;
        if ('`' === nw) P += .23;
        if ('`' === n)  P += .23;
        if ('`' === ne) P += .23;
        
        if ('.' === w)  P += .01;
        if ('.' === nw) P += .01;
        if ('.' === n)  P += .01;
        if ('.' === ne) P += .01;
        
        return P;
    },
    ',': function(w, nw, n, ne) { // LONG GRASS
        var P = 0;
        
        if (',' === w)  P += .20;
        if (',' === nw) P += .10;
        if (',' === n)  P += .10;
        if (',' === ne) P += .10;
        
        if ('.' === nw) P += .05;
        if ('.' === n)  P += .05;
        if ('.' === ne) P += .05;
        
        return P;
    },
}



var tundraData2 = {
    '.': function(w, nw, n, ne) { // SHORT GRASS
        var P = 0;
        
        if ('`' === nw) P += .01;
        if ('`' === n)  P += .01;
        if ('`' === ne) P += .01;
        
        if ('.' === w)  P += .15;
        if ('.' === nw) P += .15;
        if ('.' === n)  P += .15;
        if ('.' === ne) P += .15;
        
        if (',' === w)  P += .10;
        if (',' === nw) P += .10;
        if (',' === n)  P += .10;
        if (',' === ne) P += .10;
        
        return P;
    },
    '`': function(w, nw, n, ne) { // SNOW
        var P = 0;
        
        if ('`' === w)  P += .30;
        if ('`' === nw) P += .23;
        if ('`' === n)  P += .23;
        if ('`' === ne) P += .23;
        
        /*if ('.' === w)  P += .01;
        if ('.' === nw) P += .01;
        if ('.' === n)  P += .01;
        if ('.' === ne) P += .01;*/
        
        return P;
    },
    ',': function(w, nw, n, ne) { // LONG GRASS
        var P = 0;
        
        if (',' === w)  P += .20;
        if (',' === nw) P += .10;
        if (',' === n)  P += .10;
        if (',' === ne) P += .10;
        
        if ('.' === nw) P += .05;
        if ('.' === n)  P += .05;
        if ('.' === ne) P += .05;
        
        return P;
    },
}


var tundraData = {
    '.': function(w, nw, n, ne) { // SHORT GRASS
        var P = 0;
        
        if ('`' === nw) P += .0001;
        if ('`' === n)  P += .0001;
        if ('`' === ne) P += .0001;
        
        if ('.' === w)  P += .23;
        if ('.' === nw) P += .23;
        if ('.' === n)  P += .23;
        if ('.' === ne) P += .23;
        
        if (',' === w)  P += .15;
        if (',' === nw) P += .12;
        if (',' === n)  P += .12;
        if (',' === ne) P += .12;
        
        return P;
    },
    '`': function(w, nw, n, ne) { // SNOW
        var P = 0;
        
        if ('`' === w)  P += .30;
        if ('`' === nw) P += .23;
        if ('`' === n)  P += .23;
        if ('`' === ne) P += .23;
        
        if ('.' === w)  P += .01;
        if ('.' === nw) P += .01;
        if ('.' === n)  P += .01;
        if ('.' === ne) P += .01;
        
        return P;
    },
    ',': function(w, nw, n, ne) { // LONG GRASS
        var P = 0;
        
        if (',' === w)  P += .20;
        if (',' === nw) P += .20;
        if (',' === n)  P += .20;
        if (',' === ne) P += .20;
        
        if ('.' === nw) P += .12;
        if ('.' === n)  P += .12;
        if ('.' === ne) P += .12;
        
        return P;
    },
}

var equalData = {
    '.': function(w, nw, n, ne) { // SHORT GRASS
        var P = 0;
        
        if ('`' === nw) P += .00001;
        if ('`' === n)  P += .00001;
        if ('`' === ne) P += .00001;
        if ('`' === ne) P += .00001;
        
        if ('.' === w)  P += .24;
        if ('.' === nw) P += .24;
        if ('.' === n)  P += .24;
        if ('.' === ne) P += .24;
        
        return P;
    },
    '`': function(w, nw, n, ne) { // SNOW
        var P = 0;
        
        if ('`' === w)  P += .25;
        if ('`' === nw) P += .20;
        if ('`' === n)  P += .20;
        if ('`' === ne) P += .20;
        
        if ('.' === w)  P += .0001;
        if ('.' === nw) P += .0001;
        if ('.' === n)  P += .0001;
        if ('.' === ne) P += .0001;
        
        return P;
    }
}




/********************
 * Helper Functions *
 ********************/

function arraySum (array) {
    var sum = 0;
    
    for (var i in array) {
        sum += array[i].probability;
    }
    
    return sum;
}

function normalize (array) {
    
    var total = arraySum(array);
    
    if (total === 0) {
        return array;
    }
    
    for (var i in array) {
        array[i].probability = array[i].probability / total;
    }
    
    array.sort(function(a,b){
        return a.probability - b.probability;
    });
    
    var prev = 0;
    
    for (var i in array) {
        array[i].probability += prev;
        prev = array[i].probability;
    }
    
    return array;
}

exports.generateFromSeed = generateFromSeed;

generateFromSeed("./input.txt", "./output.txt", equalData, 1000, 1000);