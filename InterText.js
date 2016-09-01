/*Script to find intertextualities bewteen 2 texts
 *Author: Christopher Hench
 */

var compareStrings = function(strings) {

  leven = strings[0].levenshtein(strings[1]);

  return leven;
};

var searchThroughList = function(searchString, listOfStrings) {

    var stringArray = [];
    for (i = 0; i < listOfStrings.length; i++) {
        stringArray.push([searchString.toLowerCase(), listOfStrings[i].toLowerCase()]);
    }

    var results = [];
    for (i = 0; i < stringArray.length; i++) {
        results.push(compareString(stringArray[i]));
    }

    var sortedResults = [];

    var finalResult = [];
    for (i = 0; i < sortedResults.length; i++) {
        if (sortedResults[i][2] > threshold) {
            finalResult.push(sortedResults[i]);
        }
    }

    if (finalResult.length > 0) {
        var loweredList = [];
        for (i = 0; i < listOfStrings.length; i++) {
            loweredList.push(listOfStrings[i].toLowerCase());
        }
        return listOfStrings[loweredList.indexOf(finalResult[0][1])];
    } else {
        return False;
    }
};

var generateSearchableHashFromList = function(listOfStrings) {

    var sHash = {};
    for (i = 0; i < listOfStrings.length; i++) {
        for (n = 0; n < (listOfStrings.length - 1); n++) {
            var doublet = listOfStrings[i].substring(n, n + 2).toLowerCase();
            console.log(doublet);
            if (!(doublet in sHash)) {
                sHash[doublet] = [];
            }
            sHash[doublet].push(listOfStrings[i]);
        }
    }

    return sHash;
};

var searchThroughHash = function(searchString, sHash, listOfStrings) {

    searchString = searchString.toLowerCase();
    possibleStrings = [];
    for (i = 0; i < (searchString.length - 2); i++) {
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
    for (s = 0; s < counts.length; s++) {
        sortable.push([s, counts[s]]);
    }
    var countsSorted = sortable.sort(
        function(a, b) {
            return a[1] - b[1];
        }
    );
    var mostCommonCounts = countsSorted.slice(1, 1000);
    var mostCommon = [];
    for (d = 0; d < mostCommonCounts.length; d++) {
        mostCommon.push(mostCommonCounts[d][1]);
    }
    mostPossible = [];
    for (p = 0; p < 1000; p++) {
        mostPossible.push(most_common[p]);
    }

    return searchThroughList.call(searchString, mostPossible);
};

/**
 * ngram function
 */
String.prototype.wordNgrams = function(n) {
    var r = [];
    var splitN = this.split(" ");
    for (i = 0; i <= splitN.length - n; i++) {
        r.push(splitN.slice(i, i + n));
    }
    return r;
};

/*
 * Levenshtein
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

var text1 = "";
var text2 = "";
var compWindow= 3;
var thresh = 3;

var text1Words = text1.split(" ");
var text2Words = text2.split(" ");

var text1Tris = text1Words.wordNgrams(3);
var text2Tris = text2Words.wordNgrams(3);

var joinedTrisObjText2 = {};
var joinedTrisText2 = [];

for (i = 0; i < text2Tris.length; i++) {
  sortedTri = text2Tris[i].sort();
  joinedTri = sortedTri.join('');
  joinedTrisObjText2[joinedTri] = i;
  joinedTrisText2.push(joinedTri);
}

var joinedTrisObjText1 = {};
var joinedTrisText1 = [];

for (i = 0; i < text1Tris.length; i++) {
  sortedTri = text1Tris[i].sort();
  joinedTri = sortedTri.join('');
  joinedTrisObjText1[joinedTri] = i;
  joinedTrisText1.push(joinedTri);
}

var hashes2 = generateSearchableHashFromList(joinedTrisText2);
var hashes1 = generateSearchableHashFromList(joinedTrisText1);

var collectedMatches = [];

for (i = 0; i < joinedTrisText1.length; i++) {
  a = searchThroughHash(joinedTrisText1[i], hashes2, joinedTrisText2);
  if (a) {
    collectedMatches.push([text2Tris[joinedTrisObjText2[a]], text1Tris[joinedTrisObjText1[a]]]);
  }
}

var add = function(a, b) {
  return a + b;
};

var siftedMatches = [];

for (i = 0; i < collectedMatches.length; i++ ) {
  triScore = 0;
  for (w = 0; w < collectedMatches[i].length; w++) {
    triScore += scoreWord(collectedMatches[i][w]);
  }
  if (triScore > 2) {
    siftedMatches.push([collectedMatches[i], triScore]);
  }
}

Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
};

var uniqueMatches = siftedMatches.unique();

for (i = 0; i < uniqueMatches.length; i++) {
  console.log(uniqueMatches[i]);
}
