const fs = require('fs')
const path = require('path')
const shallowequal = require('shallowequal')
const createError = require('http-errors')
const caseFolding = require('../modules/caseFolding')
const featuresExtraction = require('../modules/featuresExtraction')
const fixingFeatures = require('../modules/fixingFeatures')
const infoRetrieval = require('../modules/infoRetrieval')
const neoNewsMatching = require('../modules/neoNewsMatching')
const normalisasiProsaAI = require('../modules/normalisasiProsaAI')
const posTaggingStanza = require('../modules/posTaggingStanza')
const stopwordId = require('../modules/stopwordId')
const wordSynonims = require('../modules/wordSynonims')
// const punctuationRemoval = require('../modules/punctuationRemoval')
// const tokenizerId = require('../modules/tokenizerId')

module.exports = async function (req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  console.log('Accessing [API]: ', req.method + ' ' + req.originalUrl || req.url, 'CLIENT ACCESS from', ip)
  var io = req.app.get('socketio')
  var socketId = null
  var newsLists = []
  var kompasLists = []
  var tempoLists = []
  var cnnLists = []
  var detikLists = []
  var okezoneLists = []
  try {
    req.body.id ? socketId = req.body.id : socketId = null
    console.log('Sentence: ', req.body.text)
    socketId ? io.to(socketId).emit('process', { step: 'SENTENCE:\n', out: req.body.text + '\n' }) : socketId = socketId
    fs.writeFileSync('./output.txt', 'SENTENCE:\n')
    fs.appendFileSync('./output.txt', req.body.text + '\n')
    var foldedCase = caseFolding(req.body.text)
    console.log('Folded Case: ', foldedCase)
    socketId ? io.to(socketId).emit('process', { step: 'FOLDED CASE:\n', out: foldedCase + '\n' }) : socketId = socketId
    fs.writeFileSync('./output.txt', 'FOLDED CASE:\n')
    fs.appendFileSync('./output.txt', foldedCase + '\n')
    var normalizedText = await normalisasiProsaAI(foldedCase)
    console.log('Normalized Text: ', normalizedText)
    socketId ? io.to(socketId).emit('process', { step: 'NORMALIZED TEXT:\n', out: normalizedText + '\n' }) : socketId = socketId
    fs.appendFileSync('./output.txt', 'NORMALIZED TEXT:\n')
    fs.appendFileSync('./output.txt', normalizedText + '\n')
    // var removedPunctText = punctuationRemoval(normalizedText)
    // console.log('Removed Punct. Text: ', removedPunctText)
    var stopwordedText = stopwordId(normalizedText)
    console.log('Stopworded Text: ', stopwordedText)
    socketId ? io.to(socketId).emit('process', { step: 'STOPWORD TEXT:\n', out: stopwordedText + '\n' }) : socketId = socketId
    fs.appendFileSync('./output.txt', 'STOPWORD TEXT:\n')
    fs.appendFileSync('./output.txt', stopwordedText + '\n')
    // var posTaggedText = await posTaggingStanza(normalizedText)
    var posTaggedText = await posTaggingStanza(stopwordedText)
    console.log('POS Tagged Text: ', posTaggedText)
    socketId ? io.to(socketId).emit('process', { step: 'DEPENDENCY PARSED TEXT:\n', out: JSON.stringify(posTaggedText, null, 2) + '\n' }) : socketId = socketId
    fs.appendFileSync('./output.txt', 'DEPENDENCY PARSED TEXT:\n')
    fs.appendFileSync('./output.txt', JSON.stringify(posTaggedText, null, 2) + '\n')
    // var tokenizedText = tokenizerId(normalizedText)
    // console.log('Tokenized Text: ', tokenizedText)
    var features = await featuresExtraction(posTaggedText)
    console.log('Features: ', features)
    socketId ? io.to(socketId).emit('process', { step: 'FEATURES:\n', out: JSON.stringify(features, null, 2) + '\n' }) : socketId = socketId
    fs.appendFileSync('./output.txt', 'FEATURES:\n')
    fs.appendFileSync('./output.txt', JSON.stringify(features, null, 2) + '\n')
    if (shallowequal(features, {})) {
      // socketId ? io.to(socketId).emit('process', { step: 'RESULT:\n', out: JSON.stringify({ message: 'Not a description or a self description' }, null, 2) + '\n' }) : socketId = socketId
      fs.appendFileSync('./output.txt', 'RESULT:\n')
      fs.appendFileSync('./output.txt', JSON.stringify({
        message: 'Not a description or a self description'
      }, null, 2) + '\n')
      res.status(200).json({
        message: 'Not a description or a self description'
      })
    } else {
      var fixedFeatures = fixingFeatures(features)
      console.log('Fixed Features: ', fixedFeatures)
      socketId ? io.to(socketId).emit('process', { step: 'FIXED FEATURES:\n', out: JSON.stringify(fixedFeatures, null, 2) + '\n' }) : socketId = socketId
      fs.appendFileSync('./output.txt', 'FIXED FEATURES:\n')
      fs.appendFileSync('./output.txt', JSON.stringify(fixedFeatures, null, 2) + '\n')
      kompasLists = await infoRetrieval(fixedFeatures, 'kompas.com')
      kompasLists.length > 0 ? kompasLists.map(x => newsLists.push(x)) : newsLists = newsLists
      // console.log('List Berita Kompas: ', listBeritaKompas)
      tempoLists = await infoRetrieval(fixedFeatures, 'tempo.co')
      tempoLists.length > 0 ? tempoLists.map(x => newsLists.push(x)) : newsLists = newsLists
      // console.log('List Berita Tempo: ', listBeritaTempo)
      cnnLists = await infoRetrieval(fixedFeatures, 'cnnindonesia.com')
      cnnLists.length > 0 ? cnnLists.map(x => newsLists.push(x)) : newsLists = newsLists
      // console.log('List Berita CNN: ', listBeritaCNN)
      detikLists = await infoRetrieval(fixedFeatures, 'detik.com')
      detikLists.length > 0 ? detikLists.map(x => newsLists.push(x)) : newsLists = newsLists
      // console.log('List Berita Detik: ', listBeritaDetik)
      okezoneLists = await infoRetrieval(fixedFeatures, 'okezone.com')
      okezoneLists.length > 0 ? okezoneLists.map(x => newsLists.push(x)) : newsLists = newsLists
      // console.log('List Berita Okezone: ', listBeritaOkezone)
      console.log('News Lists: ', newsLists)
      socketId ? io.to(socketId).emit('process', { step: 'NEWS LISTS:\n', out: JSON.stringify(newsLists, null, 2) + '\n' }) : socketId = socketId
      fs.appendFileSync('./output.txt', 'NEWS LISTS:\n')
      fs.appendFileSync('./output.txt', JSON.stringify(newsLists, null, 2) + '\n')
      if (newsLists.length > 0) {
        var synonims = await wordSynonims(fixedFeatures)
        console.log('Synonim Words: ', synonims)
        socketId ? io.to(socketId).emit('process', { step: 'SYNONIMS:\n', out: JSON.stringify(synonims, null, 2) + '\n' }) : socketId = socketId
        fs.appendFileSync('./output.txt', 'SYNONIMS:\n')
        fs.appendFileSync('./output.txt', JSON.stringify(synonims, null, 2) + '\n')
        var matchingNews = neoNewsMatching(synonims, newsLists)
        console.log('News Matching: ', matchingNews)
        socketId ? io.to(socketId).emit('process', { step: 'NEWS MATCHING:\n', out: JSON.stringify(matchingNews, null, 2) + '\n' }) : socketId = socketId
        fs.appendFileSync('./output.txt', 'NEWS MATCHING:\n')
        fs.appendFileSync('./output.txt', JSON.stringify(matchingNews, null, 2) + '\n')
        if (matchingNews.peristiwa === 1 && matchingNews.objek === 1 && matchingNews.deskripsi === 1) {
          fs.appendFileSync('./output.txt', 'RESULT:\n')
          fs.appendFileSync('./output.txt', JSON.stringify({
            result: 'NOT A HOAX',
            message: 'Proven to have news that reported'
          }, null, 2) + '\n')
          res.status(200).json({
            result: 'NOT A HOAX',
            message: 'Proven to have news that reported'
          })
        } else {
          fs.appendFileSync('./output.txt', 'RESULT:\n')
          fs.appendFileSync('./output.txt', JSON.stringify({
            result: 'HOAX',
            message: 'There is unmatch between peristiwa, objek or deskripsi within the news reported'
          }, null, 2) + '\n')
          res.status(200).json({
            result: 'HOAX',
            message: 'There is unmatch between peristiwa, objek or deskripsi within the news reported'
          })
        }
      } else {
        fs.appendFileSync('./output.txt', 'RESULT:\n')
        fs.appendFileSync('./output.txt', JSON.stringify({
          result: 'HOAX',
          message: 'Not a single news source reporting it'
        }, null, 2) + '\n')
        res.status(200).json({
          result: 'HOAX',
          message: 'Not a single news source reporting it'
        })
      }
    }
  } catch (err) {
    next(createError(500))
  }
}
