/*Script to find intertextualities bewteen 2 texts
 *Author: Christopher Hench
 */

/**
 * returns the edit distance between
 * two string using the Levenshtein
 */
var compareStrings = function(strings) {

  leven = strings[0].levenshtein(strings[1]);

  return leven;
};

/**
 * searches through list of strings from the hash table
 * and compares with a search string
 */
var searchThroughList = function(searchString, listOfStrings) {

    var stringArray = [];
    for (var i = 0; i < listOfStrings.length; i++) {
        stringArray.push([searchString.toLowerCase(), listOfStrings[i].toLowerCase()]);
    }

    var results = [];
    for (i = 0; i < stringArray.length; i++) {
        var score = compareStrings(stringArray[i]);
        results.push([stringArray[i][0], stringArray[i][1], score]);
    }

    var sortedResults = results.sort(
        function(a, b) {
            return a[2] - b[2];
        }
    );

    sortedResults = sortedResults.reverse();

    var finalResults = [];
    for (i = 0; i < sortedResults.length; i++) {
      // threshold set below
      if (sortedResults[i][2] < 6) {
        finalResults.push(sortedResults[i]);
      }
    }

    if (finalResults.length > 0) {
        var loweredList = [];
        for (i = 0; i < listOfStrings.length; i++) {
            loweredList.push(listOfStrings[i].toLowerCase());
        }
        var jTri = listOfStrings[loweredList.indexOf(finalResults[0][1])];
        return jTri;
    } else {
        return false;
    }
};

/**
 * generates hash table from list of joined trigrams
 */
var generateSearchableHashFromList = function(listOfStrings) {

    var sHash = {};
    var doublet = "";
    for (var i = 0; i < listOfStrings.length; i++) {
        for (n = 0; n < (listOfStrings[i].length - 2); n++) {
            doublet = listOfStrings[i];
            doublet = doublet.substring(n, n + 3);
            if (!(doublet in sHash)) {
                sHash[doublet] = [];
            }
            sHash[doublet].push(listOfStrings[i]);
        }
    }

    return sHash;
};

/**
 * searches through hash to retrieve corresponding
 * list of strings
 */
var searchThroughHash = function(searchString, sHash, listOfStrings) {

    searchString = searchString.toLowerCase();
    possibleStrings = [];
    for (var i = 0; i < (searchString.length - 2); i++) {
        var doublet = searchString.substring(i, i + 3);
        if (doublet in sHash) {
            possibleStrings.push.apply(possibleStrings, sHash[doublet]);
        }
    }
    var counts = {};
    for (i = 0; i < possibleStrings.length; i++) {
        counts[possibleStrings[i]] = 1 + (counts[possibleStrings[i]] || 0);
    }
    var sortable = [];
    for (var key in counts) {
        sortable.push([key, counts[key]]);
    }
    var countsSorted = sortable.sort(
        function(a, b) {
            return a[1] - b[1];
        }
    );
    var mostCommonCounts = countsSorted.slice(-1000);
    var mostCommon = [];
    for (d = 0; d < mostCommonCounts.length; d++) {
        mostCommon.push(mostCommonCounts[d][0]);
    }

    return searchThroughList(searchString, mostCommon);
};

/**
 * simple ngram function to change array of words
 * to ngrams
 */
function ngrams(array, length) {
    var ngramsArray = [];

    for (var i = 0; i < array.length - (length - 1); i++) {
        var subNgramsArray = [];

        for (var j = 0; j < length; j++) {
            subNgramsArray.push(array[i + j]);
        }

        ngramsArray.push(subNgramsArray);
    }

    return ngramsArray;
}


/**
 * Levenshtein algortihm
 */
String.prototype.levenshtein = function(string) {
    var a = this,
        b = string + "",
        m = [],
        i, j, min = Math.min;

    if (!(a && b)) return (b || a).length;

    for (i = 0; i <= b.length; m[i] = [i++]);
    for (j = 0; j <= a.length; m[0][j] = j++);

    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            m[i][j] = b.charAt(i - 1) == a.charAt(j - 1) ?
                m[i - 1][j - 1] :
                m[i][j] = min(
                    m[i - 1][j - 1] + 1,
                    min(m[i][j - 1] + 1, m[i - 1][j] + 1));
        }
    }

    return m[b.length][a.length];
};


// Main program starts here

// only for testing
var fs = require('fs');
var text1 = fs.readFileSync('texts/amoris.txt', "utf8");
var text2 = fs.readFileSync('texts/cb.txt', "utf8");

// for web implementation
// var text1 = "";
// var text2 = "";
var compWindow= 3;
var thresh = 3;

var text1Words = text1.split(" ");
var text2Words = text2.split(" ");

var text1Tris = ngrams(text1Words, 3);
var text2Tris = ngrams(text2Words, 3);

var joinedTrisObjText2 = {};
var joinedTrisText2 = [];

for (var i = 0; i < text2Tris.length; i++) {
  sortedTri = text2Tris[i].sort();
  joinedTri = sortedTri.join('');
  joinedTrisObjText2[joinedTri] = i;
  joinedTrisText2.push(joinedTri);
}

var joinedTrisObjText1 = {};
var joinedTrisText1 = [];

for (var i = 0; i < text1Tris.length; i++) {
  sortedTri = text1Tris[i].sort();
  joinedTri = sortedTri.join('');
  joinedTrisObjText1[joinedTri] = i;
  joinedTrisText1.push(joinedTri);
}

var hashes2 = generateSearchableHashFromList(joinedTrisText2);

var collectedMatches = [];

for (var i = 0; i < joinedTrisText1.length; i++) {
  var t = joinedTrisText1[i];
  var a = searchThroughHash(t, hashes2, joinedTrisText2);
  if (a) {
    collectedMatches.push([text2Tris[joinedTrisObjText2[a]], text1Tris[joinedTrisObjText1[t]]]);
  }
}

console.log(collectedMatches);

// var add = function(a, b) {
//   return a + b;
// };

// var siftedMatches = [];

// for (i = 0; i < collectedMatches.length; i++ ) {
//   triScore = 0;
//   for (w = 0; w < collectedMatches[i].length; w++) {
//     triScore += scoreWord(collectedMatches[i][w]);
//   }
//   if (triScore > 2) {
//     siftedMatches.push([collectedMatches[i], triScore]);
//   }
// }

// Array.prototype.contains = function(v) {
//     for(var i = 0; i < this.length; i++) {
//         if(this[i] === v) return true;
//     }
//     return false;
// };

// Array.prototype.unique = function() {
//     var arr = [];
//     for(var i = 0; i < this.length; i++) {
//         if(!arr.contains(this[i])) {
//             arr.push(this[i]);
//         }
//     }
//     return arr; 
// };

// var uniqueMatches = siftedMatches.unique();

// for (i = 0; i < uniqueMatches.length; i++) {
//   console.log(uniqueMatches[i]);
// }
