/**
 * modules used
 */
const removePunctuation = require('remove-punctuation')

/**
 * Features Extraction
 *
 * @param {String} taggedSentence The POS tagged sentence needs to be feature extracted
 */
module.exports = function featuresExtraction(taggedSentence) {
  // var sentenceType = ''
  const regexList = /[‘“’”'"]+/g
  const questionWords = ['apa', 'siapa', 'kapan', 'dimana', 'kemana', 'darimana', 'mengapa', 'kenapa', 'bagaimana']
  var quotationMark = 0
  var rootToken = {
    token: '',
    id: 0
  }
  var features = {
    fakta: [],
    deskripsi: []
  }
  console.log('Tagged Sentence: ', taggedSentence.tokens)
  var eachToken = taggedSentence.tokens
  // is it a question
  if (eachToken.some(r => r.token.includes(questionWords))) {
    console.log('This is a question')
    return {}
  }
  for (var i = 0; i < eachToken.length; i++) {
    if (eachToken[i].token.match(regexList)) {
      // console.log('Have regex')
      quotationMark++
    }
  }
  for (var i = 0; i < eachToken.length; i++) {
    // is it a question
    if (eachToken[i].token.substr(eachToken[i].token.length - 3, 3) === 'kah') {
      console.log('This is a question')
      return {}
    }
    // is it a self description
    if (quotationMark === 0) {
      if (eachToken[i].pos === 'PRON') {
        if (eachToken[i].token === 'aku') {
          console.log('This is a self description')
          return {}
        } else if (eachToken[i].token === 'saya') {
          console.log('This is a self description')
          return {}
        } else if (eachToken[i].token === 'kami') {
          console.log('This is a self description')
          return {}
        } else if (eachToken[i].token === 'menurutku') {
          console.log('This is a self description')
          return {}
        }
      }
    }
    // is it includes fakta needs to be checked
    if (eachToken[i].parent_rel === 'root') {
      if (eachToken[i].pos === 'VERB') {
        features.deskripsi.push(eachToken[i].token)
        rootToken.token = eachToken[i].token
        rootToken.id = eachToken[i].id
      } else if (eachToken[i].pos === 'NOUN') {
        features.fakta.push(eachToken[i].token)
        rootToken.token = eachToken[i].token
        rootToken.id = eachToken[i].id
      } else if (eachToken[i].pos === 'PROPN') {
        features.fakta.push(eachToken[i].token)
        rootToken.token = eachToken[i].token
        rootToken.id = eachToken[i].id
      } else {
        console.log('This is not a fact to be checked')
        return {}
      }
    } else {
      if (eachToken[i].parent_rel === 'obj') {
        features.fakta.push(eachToken[i].token)
      } else if (eachToken[i].parent_rel.includes('nsubj')) {
        features.fakta.push(eachToken[i].token)
      }
    }
  }
  if (features.fakta.length === 0) {
    console.log('This is not a fact to be checked')
    return {}
    // console.log('Hasil: Narasi Tidak terdapat Peristiwa')
  } else {
    console.log('Root: ', rootToken)
    for (var i = 0; i < eachToken.length; i++) {
      if (eachToken[i].pos === 'VERB') {
        if (eachToken[i].token !== features.deskripsi[0]) {
          features.deskripsi.push(eachToken[i].token)
        }
      } else if (eachToken[i].pos === 'NOUN') {
        if (!features.fakta.some(r => r.includes(eachToken[i].token))) {
          features.deskripsi.push(eachToken[i].token)
        }
      } else if (eachToken[i].pos === 'PROPN') {
        if (!features.fakta.some(r => r.includes(eachToken[i].token))) {
          features.deskripsi.push(eachToken[i].token)
        }
      } else if (eachToken[i].pos === 'NUM') {
        features.deskripsi.push(eachToken[i].token)
      } else if (eachToken[i].pos === 'ADV') {
        features.deskripsi.push(eachToken[i].token)
      } else if (eachToken[i].pos === 'ADJ') {
        features.deskripsi.push(eachToken[i].token)
      }
    }
    // features.deskripsi = descriptors.join(' ')
    // features.peristiwa = removePunctuation(features.peristiwa)
    // features.objek = removePunctuation(features.objek)
    for (var i = 0; i < features.fakta.length; i++) {
      features.fakta[i] = features.fakta[i].toString().toLowerCase()
      features.fakta[i] = removePunctuation(features.fakta[i])
      // features.fakta[i].replace(/`“/g, '')
    }
    for (var i = 0; i < features.deskripsi.length; i++) {
      features.deskripsi[i] = features.deskripsi[i].toString().toLowerCase()
      features.deskripsi[i] = removePunctuation(features.deskripsi[i])
      // features.deskripsi[i].replace(/`“/g, '')
    }
    // console.log('Peristiwa: ', features.peristiwa)
    // console.log('Objek: ', features.objek)
    // console.log('Deskripsi: ', features.deskripsi)
    return features
  }
}

/**
 * example
 */
// tokenizerId('linguistik korpus adalah metode linguistik yang menggunakan data dari bahan-bahan bahasa yang terkumpul dalam suatu sumber yang disebut korpus atau korpora (sejenis "bank" bahasa) yang berasal dari penggunaan bahasa dalam berbagai genre, ragam, dan bahan lisan maupun tertulis yang menjamin keragaman yang seluas-luasnya dan menghindari penggunaan bahasa yang sangat sempit seperti idiolek.')
