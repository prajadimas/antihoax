/**
 * modules used
 */
const axios = require('axios')

/**
 * PosTagging Stanza
 *
 * @param {String} sentence The sentence needs to be postagged using Stanza API
 */
module.exports = function posTaggingStanza(sentence) {
// function posTaggingStanza(sentence) {
  return new Promise(async (resolve, reject) => {
    try {
      var results = await axios.get('http://103.122.5.98:5000/api/postag?s=' + encodeURIComponent(sentence))
      // var results = await axios.get('http://127.0.0.1:5000/api/postag?s=' + encodeURIComponent(sentence))
      console.log('Proses POSTagger Stanza: ', results.data)
      resolve(results.data)
    } catch (err) {
      // handle error
      console.error(err)
      reject(err)
    }
  })
}
