const expect = require('chai').expect
const normalisasiProsaAI = require('../modules/normalisasiProsaAI')

describe('normalisasi', function () {
  // testing normalisasi prosa ai
  // slow if return response below 500 ms
  this.slow(500)
  it('should return indonesian normalized text', (done) => {
    normalisasiProsaAI('pd hari minggu ku turu ayah ke kota.')
    .then((text) => {
      // console.log(text)
      expect(text)
      .to.be.a('string')
      .and.equal('pada hari minggu ku turut ayah ke kota.')
      done()
    })
    .catch((err) => {
      return done(err)
    })
  })

})
