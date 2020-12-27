/**
 * modules used
 */
const googleIt = require('google-it')

/**
 * Information Retrieval Module
 *
 * @param {String} token Token retrieval
 * @param {String} source News sources
 */
module.exports = function (token, source) {
  return new Promise(async (resolve, reject) => {
    try {
      var results = []
      var tokenJoin = ''
      for (var i = 0; i < token.length; i++) {
        if (i < (token.length - 1)) {
          tokenJoin += token[i].token + ' '
        } else {
          tokenJoin += token[i].token
        }
      }
      // tokenJoin += ' ' + source
      console.log('Query: ', tokenJoin)
      var retrieval = await googleIt({ 'query': tokenJoin, 'limit': 5, 'no-display': true })
      // access to results object here
      // console.log('Info Retrieval: ', retrieval)
      retrieval.map(x => x.link.includes(source) ? results.push(x) : results = results)
      resolve(results)
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })
}
