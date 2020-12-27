/**
 * modules used
 */
const sw = require('stopword')

/**
 * Fixing Features
 *
 * @param {String} x Features need to be fixed (tokenization, stopword)
 */
module.exports = function fixingFeatures(x) {
  // console.log('X: ', x)
  var allFeatures = []
  var deskripsiRemovedStopword = sw.removeStopwords(x.deskripsi, sw.id)
  allFeatures.push({
    token: x.peristiwa,
    tag: 'peristiwa'
  })
  allFeatures.push({
    token: x.objek,
    tag: 'objek'
  })
  for (var i = 0; i < deskripsiRemovedStopword.length; i++) {
    allFeatures.push({
      token: deskripsiRemovedStopword[i].replace(/\.$/, ''),
      tag: 'deskripsi'
    })
  }
  return allFeatures
}
