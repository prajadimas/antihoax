/**
 * modules used
 */
const axios = require('axios')

/**
 * Normalisasi berdasarkan Prosa AI
 *
 * @param {String} sentence The sentence needs to be normalized using Prosa AI API
 */
module.exports = function normalisasiProsaAI(sentence) {
  return new Promise(async (resolve, reject) => {
    try {
      var results = await axios({
        method: 'POST',
        url: 'https://api.prosa.ai/v1/normals',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '2itf7S0oOF1pzozNIxK2dj9jnkgnk0Q7mixreGZn'
        },
        data: {
          'text': sentence
        }
      })
      console.log('Proses Normalisasi Prosa AI: ', results.data)
      resolve(results.data.text)
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })
}
