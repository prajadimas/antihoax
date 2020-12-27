/**
 * modules used
 */
const removePunctuation = require('remove-punctuation')

/**
 * Feature Extraction
 *
 * @param {String} taggedSentence The POS tagged sentence needs to be feature extracted
 */
module.exports = function featuresExtraction(taggedSentence) {
  var sentenceType = ''
  var descriptors = []
  var rootToken = {
    token: '',
    id: 0
  }
  var features = {
    peristiwa: '',
    objek: '',
    deskripsi: []
  }
  console.log('Tagged Sentence: ', taggedSentence.tokens)
  var eachToken = taggedSentence.tokens
  for (var i = 0; i < eachToken.length; i++) {
    // if (eachToken[i])
    if (eachToken[i].pos === 'PRON') {
      if (eachToken[i].token === 'aku') {
        return {}
      } else if (eachToken[i].token === 'saya') {
        return {}
      } else if (eachToken[i].token === 'kami') {
        return {}
      }
    }
    if (eachToken[i].parent_rel === 'root') {
      if (eachToken[i].pos === 'VERB') {
        features.peristiwa = eachToken[i].token
        rootToken.token = eachToken[i].token
        rootToken.id = eachToken[i].id
        if (eachToken[i].token.substring(0, 3) === 'ber' || eachToken[i].token.substring(0, 3) === 'ter') {
          sentenceType = 'aktif intransitif'
        } else if (eachToken[i].token.substring(0, 2) === 'me') {
          sentenceType = 'aktif transitif'
        } else if (eachToken[i].token.substring(0, 2) === 'di') {
          if (eachToken[i].id === 1) {
            sentenceType = 'inversi'
          } else {
            sentenceType = 'pasif'
          }
        } else {
          sentenceType = 'aktif transitif'
        }
      }
    }
  }
  if (features.peristiwa === '') {
    return {}
    // console.log('Hasil: Narasi Tidak terdapat Peristiwa')
  } else {
    console.log('Root: ', rootToken)
    console.log('Sentence Type: ', sentenceType)
    if (sentenceType === 'aktif transitif') {
      // for (var i = (rootToken.id - 1); i < eachToken.length; i++) {
      for (var i = 0; i < eachToken.length; i++) {
        if (eachToken[i].parent_rel === 'obj') {
          if (features.objek === '') {
            features.objek = eachToken[i].token
          }
        }
      }
    } else if (sentenceType === 'pasif') {
      // for (var i = 0; i < (rootToken.id - 1); i++) {
      for (var i = 0; i < eachToken.length; i++) {
        if (eachToken[i].parent_rel === 'obj' || eachToken[i].parent_rel.includes('subj')) {
        // if (eachToken[i].parent_rel === 'obj') {
          if (features.objek === '') {
            features.objek = eachToken[i].token
          } else {
            if (eachToken[i].parent_rel === 'obj') {
              features.objek = eachToken[i].token
            }
          }
        }
      }
    } else if (sentenceType === 'inversi') {
      for (var i = (rootToken.id - 1); i < eachToken.length; i++) {
        if (eachToken[i].parent_rel === 'obj') {
          if (features.objek === '') {
            features.objek = eachToken[i].token
          }
        }
      }
    } else {
      for (var i = 0; i < eachToken.length; i++) {
        if (eachToken[i].parent_rel === 'obj') {
          if (features.objek === '') {
            features.objek = eachToken[i].token
          }
        }
      }
    }
    for (var i = 0; i < eachToken.length; i++) {
      if (eachToken[i].pos === 'NOUN') {
        if (eachToken[i].token !== features.objek) {
          features.deskripsi.push(eachToken[i].token)
        }
      } else if (eachToken[i].pos === 'PROPN') {
        if (eachToken[i].token !== features.objek) {
          features.deskripsi.push(eachToken[i].token)
        }
      } else if (eachToken[i].pos === 'NUM') {
        if (eachToken[i].token !== features.objek) {
          features.deskripsi.push(eachToken[i].token)
        }
      } else if (eachToken[i].pos === 'ADV') {
        if (eachToken[i].token !== features.objek) {
          features.deskripsi.push(eachToken[i].token)
        }
      } else if (eachToken[i].pos === 'ADJ') {
        if (eachToken[i].token !== features.objek) {
          features.deskripsi.push(eachToken[i].token)
        }
      } else if (eachToken[i].pos === 'VERB') {
        if (eachToken[i].token !== features.peristiwa) {
          features.deskripsi.push(eachToken[i].token)
        }
      }
    }
    // features.deskripsi = descriptors.join(' ')
    features.peristiwa = removePunctuation(features.peristiwa)
    features.objek = removePunctuation(features.objek)
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
