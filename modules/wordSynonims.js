/**
 * modules used
 */
const axios = require('axios')
const cheerio = require('cheerio')

/**
 * Word Synonim
 *
 * @param {String} token Token searching for synonim words
 */
module.exports = function wordSynonims(token) {
// function wordSynonims(token) {
  return new Promise(async (resolve, reject) => {
    var outputToken = []
    try {
      var countToken = -1
      console.log('Token Tags: ', token)
      var nextToken = async function () {
        try {
          if (countToken < (token.length - 1)) {
            countToken++
            var temp = []
            var anotherTemp = []
            outputToken.push({
              token: token[countToken].token,
              tag: token[countToken].tag,
              synonim: []
            })
            // console.log('Token: ', token[countToken])
            outputToken[countToken].synonim.push(token[countToken].token)
            // var response = await axios.get('http://tesaurus.kemdikbud.go.id/tematis/lema/' + token[countToken].token + '/' + kelasTesaurus[token[countToken].tag])
            var response = await axios.get('http://www.sinonimkata.com/b-' + token[countToken].token)
            // handle success
            // console.log(response.data)
            const $ = cheerio.load(response.data)
            // console.log()
            if ($('.lemmas').text()) {
              // console.log($('.lemmas').text())
              $('.lemmas').each(function (i, element) {
                var word = ''
                var a = $(this)
                // console.log(a.text())
                word = a.text().toLowerCase()
                temp.push(word)
              })
              anotherTemp = temp[0].split(', ')
              anotherTemp.splice(anotherTemp.indexOf(''), 1)
              anotherTemp[0] = anotherTemp[0].replace('sinonim:', '')
              anotherTemp.splice(anotherTemp.indexOf(':'), 1)
              // console.log(anotherTemp)
            }
            for (var i = 0; i < anotherTemp.length; i++) {
              outputToken[countToken].synonim.push(anotherTemp[i])
            }
            nextToken()
          } else {
            // console.log('Token: ', token)
            for (var i = 0; i < outputToken.length; i++) {
              outputToken[i].synonim = [...new Set(outputToken[i].synonim)]
            }
            // console.log('Tokens: ', outputToken)
            resolve(outputToken)
          }
        } catch (err) {
          console.error(err)
          reject(err)
        }
      }
      nextToken()
    } catch (err) {
      // handle error
      console.error(err)
      reject(err)
    }
  })
}

/* function wordSynonim(token) {
  return new Promise(async (resolve, reject) => {
    var outputToken = []
    try {
      var countToken = -1
      console.log('Token Tags: ', token)
      var nextToken = async function () {
        try {
          if (countToken < (token.length - 1)) {
            countToken++
            outputToken.push({
              token: token[countToken].token,
              tag: token[countToken].tag,
              padanan: []
            })
            console.log('Token: ', token[countToken].token)
            outputToken[countToken].padanan.push(token[countToken].token)
            var response = await axios.get('http://tesaurus.kemdikbud.go.id/tematis/lema/' + token[countToken].token + '/' + kelasTesaurus[token[countToken].tag])
            // handle success
            // console.log(response.data)
            const $ = cheerio.load(response.data)
            // * $('.result-postag').each(function (i, element) {
              // var a = $(this)
              // console.log(a.text())
            // }) * /
            // if ($('.article-label')) {
              // $('.article-label').each(function (i, element) {
            if ($('.lemma-super')) {
              $('.lemma-super').each(function (i, element) {
                var kata = ''
                var a = $(this)
                // console.log(a.text())
                kata = a.text().toLowerCase()
                // * for (var i = 0; i < a.text().length; i++) {
                  if (/[A-Z]/.test(a.text()[i])) {
                    kata += a.text()[i].toLowerCase()
                  }
                // } * /
                outputToken[countToken].padanan.push(kata)
                // token[countToken].padanan.push(kata)
              })
            }
            nextToken()
          } else {
            // console.log('Token: ', token)
            for (var i = 0; i < outputToken.length; i++) {
              outputToken[i].padanan = [...new Set(outputToken[i].padanan)]
            }
            resolve(outputToken)
          }
        } catch (err) {
          console.error(err)
          reject(err)
        }
      }
      nextToken()
      // * resolve({
        msg: 'Padanan Kata',
        data: token
      // }) * /
    } catch (err) {
      // handle error
      console.error(err)
      reject(err)
    }
  })
} */

// wordSynonim([ 'dikawal', 'pendatang', 'china', 'dihormati', 'difasilitasi' ])
// wordSynonim(['pendatang'])
// wordSynonim(['cina'])
