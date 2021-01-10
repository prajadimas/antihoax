const { distance } = require('fastest-levenshtein')
const LevenshteinArray = require('levenshtein-array')
const natural = require('natural')
const roundTo = require('round-to')

const tokenizer = new natural.AggressiveTokenizerId()

module.exports = function neoNewsMatching(tokens, news) {
// function neoNewsMatching(tokens, news) {
  console.log('Tokens: ', tokens)
  console.log('News: ', news)
  var tempRes = []
  var newsMatching = []
  var countMatch = []
  news.map(x => {
    tempRes.push({
      fakta: 0,
      deskripsi: 0
    })
    newsMatching.push({
      fakta: 0,
      deskripsi: 0
    })
    countMatch.push(0)
    x.matching = []
    x.tokens = tokenizer.tokenize(x.snippet.toString().toLowerCase())
  })
  news.map(x => {
    tokens.map(y => {
      x.matching.push({
        token: y.token,
        tag: y.tag,
        dist: LevenshteinArray(x.tokens, y.token)[0].l
      })
    })
  })
  news.map((x, idx) => {
    // console.log(x.matching)
    x.matching.map(d => {
      if (newsMatching[idx].hasOwnProperty(d.tag)) {
        newsMatching[idx][d.tag] = newsMatching[idx][d.tag] + d.dist
      } else {
        newsMatching[idx][d.tag] = d.dist
      }
    })
  })
  // console.log('News Matching: ', newsMatching)
  newsMatching.map((x, idx) => {
    x.fakta === 0 ? tempRes[idx].fakta = 1 : tempRes[idx].fakta = tempRes[idx].fakta
    // x.objek === 0 ? tempRes[idx].objek = 1 : tempRes[idx].objek = tempRes[idx].objek
    x.deskripsi === 0 ? tempRes[idx].deskripsi = 1 : tempRes[idx].deskripsi = tempRes[idx].deskripsi
  })
  // console.log('Temp Res: ', tempRes)
  for (var i = 0; i < tempRes.length; i++) {
    countMatch[i] = tempRes[i].fakta + tempRes[i].deskripsi
  }
  // console.log('Result Value: ', tempRes[countMatch.indexOf(Math.max(...countMatch))])
  return tempRes[countMatch.indexOf(Math.max(...countMatch))]
}

/* neoNewsMatching([
  { token: 'dikawal', tag: 'peristiwa', synonim: [ 'dikawal' ] },
  {
    token: 'pendatang',
    tag: 'objek',
    synonim: [
      'pendatang',
      'ekspatriat',
      'imigran',
      'orang asing',
      'pelancong',
      'turis',
      'urban'
    ]
  },
  { token: 'china', tag: 'deskripsi', synonim: [ 'china' ] },
  { token: 'dihormati', tag: 'deskripsi', synonim: [ 'dihormati' ] },
  {
    token: 'difasilitasi',
    tag: 'deskripsi',
    synonim: [ 'difasilitasi' ]
  }
], [{
    title: 'Saat 500 TKA Asal China Akan Didatangkan di Tengah ...',
    link: 'https://regional.kompas.com/read/2020/05/03/06400071/saat-500-tka-asal-china-akan-didatangkan-di-tengah-pandemi-corona-klaim?page=all',
    snippet: '3 Mei 2020 — Saat 500 TKA Asal ,China, Akan Didatangkan di Tengah Pandemi Corona, Klaim untuk Hindari PHK ,Pekerja, Lokal. Kompas.com - 03/05/2020, 06: ...'
},
{
  link: 'https://www.cnnindonesia.com/nasional/20200623204059-20-516672/156-tka-asal-china-mendarat-di-kendari-tni-polri-kawal-ketat',
  title: '156 TKA Asal China Mendarat di Kendari, TNI-Polri Kawal Ketat',
  snippet: '23 Jun 2020 — 156 TKA asal ,China, telah mendarat di Bandara Haluoleo Kendari, langgsung ,dikawal, ketat aparat lantaran terjadi demo penolakan di sekitar'
}]) */
