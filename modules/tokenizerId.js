/**
 * modules used
 */
const natural = require('natural')

/**
 * Tokenizer ID
 *
 * @param {String} sentence The sentence needs to be tokenize
 */
module.exports = function tokenizerId(sentence) {
  const tokenizer = new natural.AggressiveTokenizerId()
  // console.log(tokenizer.tokenize(kalimat))
  return tokenizer.tokenize(sentence)
}

/**
 * example
 */
// tokenizerId('linguistik korpus adalah metode linguistik yang menggunakan data dari bahan-bahan bahasa yang terkumpul dalam suatu sumber yang disebut korpus atau korpora (sejenis "bank" bahasa) yang berasal dari penggunaan bahasa dalam berbagai genre, ragam, dan bahan lisan maupun tertulis yang menjamin keragaman yang seluas-luasnya dan menghindari penggunaan bahasa yang sangat sempit seperti idiolek.')
