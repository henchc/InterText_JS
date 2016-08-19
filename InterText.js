/*Script to find interextualities bewteen 2 texts
 *Author: Christopher Hench
 */

function generateSearchableHashFromList(listOfStrings) {
  
  var sHash = {}
  for (i = 0; i < listOfStrings.length; i ++) {
    for (n = 0; n < (listOfStrings.length - 2); i ++ {
      var doublet = listOfStrings[i].substring(n, n + 3).toLowerCase();
      if (! (doublet in sHash)) {
        sHash.doublet = [];
      }
      sHash.doublet.push(listOfStrings[i]);
    }
  }

  return sHash;
}

