const expect = require('chai').expect
const caseFolding = require('../modules/caseFolding')

describe('case fold', () => {
  // testing case folding
  it('should return lower case', () => {
    expect(caseFolding('Pada hari Minggu ku turut Ayah ke kota.')).to.equal('pada hari minggu ku turut ayah ke kota.')
  })
})
