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
  // var deskripsiRemovedStopword = sw.removeStopwords(x.deskripsi, sw.id)
  for (var i = 0; i < x.fakta.length; i++) {
    allFeatures.push({
      token: x.fakta[i].replace(/\.$/, ''),
      tag: 'fakta'
    })
  }
  for (var i = 0; i < x.deskripsi.length; i++) {
    allFeatures.push({
      token: x.deskripsi[i].replace(/\.$/, ''),
      tag: 'deskripsi'
    })
  }
  /* for (var i = 0; i < deskripsiRemovedStopword.length; i++) {
    allFeatures.push({
      token: deskripsiRemovedStopword[i].replace(/\.$/, ''),
      tag: 'deskripsi'
    })
  } */
  return allFeatures
}
