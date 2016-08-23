/*Script to find intertextualities bewteen 2 texts
 *Author: Christopher Hench
 */

function generateSearchableHashFromList(listOfStrings) {
  
  var sHash = {}
  for (i in listOfStrings) {
    for (n = 0; n < (listOfStrings.length - 1); n ++) {
      var doublet = listOfStrings[i].substring(n, n + 2).toLowerCase();
      console.log(doublet);
      if (! (doublet in sHash)) {
        sHash[doublet] = [];
      }
      sHash[doublet].push(listOfStrings[i]);
    }
  }

  return sHash;
}

function searchThroughHash(searchString, sHash, listOfStrings) {

  searchString = searchString.toLowerCase();
  possibleStrings = [];
  for (i = 0; i < (searchString.length - 2); i ++) {
    var doublet = searchString.substring(i , i + 3);
    if (doublet in sHash) {
      possibleStrings.push.apply(possibleStrings, sHash[doublet]);
    }
  }
  var counts = {};
  for (i in possibleStrings) {
        counts[possibleStrings[i]] = 1 + (counts[possibleStrings[i]] || 0);
  }
  var sortable = [];
  for (s in counts) {
    sortable.push([s, counts[s]]);
  }
  var countsSorted = sortable.sort(
      function(a, b) {
        return a[1] - b[1];
      }
  )
  var mostCommonCounts = countsSorted.slice(1, 1000)
  var mostCommon = []
  for (d in mostCommonCounts) {
    mostCommon.push(d[1])
  }
  mostPossible = [];
  for (p = 0; p < 1000; i ++) {
    mostPossible.push(most_common[p]);
  }

  return searchThroughList.call(searchString, mostPossible);
}

/**
 * ngram function
 */
String.prototype.wordNgrams = function(n) {
    var r = [];
    var splitN = this.split(" ");
    for(var i = 0; i <= splitN.length - n; i++) {
      r.push(splitN.slice(i, i + n));
    }
    return r;
}

s = "hello there my name is chris"
sl = s.wordNgrams(3);
console.log(sl);

var joinsl = []
for (n in sl) {
  joinsl.push(sl[n].join(''));
}

console.log(generateSearchableHashFromList(joinsl));
