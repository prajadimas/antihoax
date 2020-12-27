/**
 * modules used
 */
const sw = require('stopword')

/**
 * Stopword ID
 *
 * @param {String} sentence The sentence needs to be remove stopword
 */
module.exports = function stopwordId(sentence) {
  // console.log('Sentence: ', sentence)
  return sw.removeStopwords(sentence.split(' '), sw.id).join(' ')
}

/**
 * example
 */
// tokenizerId('linguistik korpus adalah metode linguistik yang menggunakan data dari bahan-bahan bahasa yang terkumpul dalam suatu sumber yang disebut korpus atau korpora (sejenis "bank" bahasa) yang berasal dari penggunaan bahasa dalam berbagai genre, ragam, dan bahan lisan maupun tertulis yang menjamin keragaman yang seluas-luasnya dan menghindari penggunaan bahasa yang sangat sempit seperti idiolek.')
