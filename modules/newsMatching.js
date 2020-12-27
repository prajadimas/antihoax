const { distance } = require('fastest-levenshtein')
const natural = require('natural')

const tokenizer = new natural.AggressiveTokenizerId()

module.exports = function (token, berita) {
// function pencocokanBerita(token, berita) {
  // const tokenizer = new natural.WordTokenizer()
  // var distanceNumber = distance(kata, berita)
  console.log('Token: ', token)
  var totalDistance = []
  var jumlahCocok = []
  var beritaData = []
  for (var i = 0; i < berita.length; i++) {
    beritaData.push({
      idx: i,
      source: berita[i].link,
      token: tokenizer.tokenize(normalizer.normalize(berita[i].snippet))
    })
  }
  console.log('Berita Length: ', berita.length)
  console.log('Berita Data Length: ', beritaData.length)
  console.log('Berita Data: ', beritaData)
  var properties = []
  for (var i = 0; i < beritaData.length; i++) {
    properties.push([])
    jumlahCocok.push(0)
    totalDistance.push(0)
  }
  for (var i = 0; i < token.length; i++) {
    for (var j = 0; j < beritaData.length; j++) {
      var distMin = Number.POSITIVE_INFINITY
      var beritaDataMin = null
      for (var k = 0; k < beritaData[j].token.length; k++) {
        for (var l = 0; l < token[i].padanan.length; l++) {
          if (k === (beritaData[j].token.length - 1)) {
            if (distance(token[i].padanan[l], beritaData[j].token[k]) < distMin) {
              beritaDataMin = beritaData[j].token[k]
              distMin = distance(token[i].padanan[l], beritaData[j].token[k])
            }
            if (distMin === 0) {
              properties[j].push({
                token: token[i],
                padanan: token[i].padanan[l],
                source: beritaData[j].source,
                beritaData: beritaDataMin,
                distance: distMin
              })
              break
            } else {
              if (l === (token[i].padanan.length - 1)) {
                properties[j].push({
                  token: token[i],
                  padanan: token[i].padanan[l],
                  source: beritaData[j].source,
                  beritaData: beritaDataMin,
                  distance: distMin
                })
              }
            }
          } else {
            if (distance(token[i].padanan[l], beritaData[j].token[k]) < distMin) {
              beritaDataMin = beritaData[j].token[k]
              distMin = distance(token[i].padanan[l], beritaData[j].token[k])
            }
          }
        }
      }
    }
  }
  console.log('Properties: ', properties)
  for (var i = 0; i < properties.length; i++) {
    for (var j = 0; j < properties[i].length; j++) {
      if (properties[i][j].distance === 0) {
        jumlahCocok[i]++
      }
      totalDistance[i] += properties[i][j].distance
    }
  }
  // var jumlahTokenPencocokan = 0
  var maxCocok = 0
  var totalDistanceMaxCocok = Number.POSITIVE_INFINITY
  for (var i = 0; i < beritaData.length; i++) {
    console.log('Jumlah Cocok dengan Berita ' + (i + 1) + ': ', jumlahCocok[i])
    console.log('Total Distance dengan Berita ' + (i + 1) + ': ', totalDistance[i])
    if (jumlahCocok[i] > maxCocok) {
      maxCocok = jumlahCocok[i],
      totalDistanceMaxCocok = totalDistance[i]
    }
  }
  return {
    cocok: roundTo((maxCocok / token.length) * 100, 3),
    distance: totalDistanceMaxCocok
  }
  /* var properties = []
  for (var i = 0; i < token.length; i++) {
    for (var j = 0; j < beritaData.length; j++) {
      var distMin = Number.POSITIVE_INFINITY
      var beritaDataMin = null
      for (var k = 0; k < beritaData[j].token.length; k++) {
        if (k === (beritaData[j].token.length - 1)) {
          if (distance(token[i], beritaData[j].token[k]) < distMin) {
            beritaDataMin = beritaData[j].token[k]
            distMin = distance(token[i], beritaData[j].token[k])
          }
          properties.push({
            token: token[i],
            source: beritaData[j].source,
            beritaData: beritaDataMin,
            distance: distMin
          })
        } else {
          if (distance(token[i], beritaData[j].token[k]) < distMin) {
            beritaDataMin = beritaData[j].token[k]
            distMin = distance(token[i], beritaData[j].token[k])
          }
        }
      }
    }
  }
  console.log('Properties: ', properties)
  var kecocokanSumber = {}
  var jumlahCocok = 0
  for (var i = 0; i < properties.length; i++) {
    if (properties[i].distance === 0) {
      jumlahCocok++
    }
    totalDistance += properties[i].distance
  }
  return {
    cocok: (jumlahCocok / properties.length) * 100,
    distance: totalDistance
  } */
}

/* pencocokanBerita([
  'survei',  'demokrat',
  'pks',     'pdip',
  'golkar',  'gerindra',
  'melorot'
],[
  {
    title: 'Survei Elektabilitas Partai: PDIP Naik Tipis, Gerindra dan PKS ...',
    link: 'https://nasional.tempo.co/read/1400453/survei-elektabilitas-partai-pdip-naik-tipis-gerindra-dan-pks-turun',
    snippet: '29 Okt 2020 — Survei, Elektabilitas Partai: ,PDIP, Naik Tipis, ,Gerindra, dan ,PKS, Turun ... partai-,,partai politik stagnan, hanya ,Gerindra, yang ,melorot,, sedangkan dua parpol ... Pada urutan berikutnya setelah ,Gerindra, adalah ,Golkar, yang turun dari 10,3 ... Kemudian NasDem (2,9 persen-4,0 persen-3,9 persen), ,Demokrat, (3,5 ...'
  }
]) */

// [ 'your', 'dog', 'has', 'fleas' ]
// tokenization('linguistik korpus adalah metode linguistik yang menggunakan data dari bahan-bahan bahasa yang terkumpul dalam suatu sumber yang disebut korpus atau korpora (sejenis "bank" bahasa) yang berasal dari penggunaan bahasa dalam berbagai genre, ragam, dan bahan lisan maupun tertulis yang menjamin keragaman yang seluas-luasnya dan menghindari penggunaan bahasa yang sangat sempit seperti idiolek.')
