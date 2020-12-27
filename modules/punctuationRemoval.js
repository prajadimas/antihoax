/**
 * modules used
 */
const removePunctuation = require('remove-punctuation')

/**
 * Remove Punctuation
 *
 * @param {String} x The sentence need to remove punctuation
 */
module.exports = function punctuationRemoval(x) {
  return removePunctuation(x)
}
