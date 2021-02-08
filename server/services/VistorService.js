const BaseDAO = require('../lib/baseDAO')
const Vistor = require('../models/mongodb').vistor

class VistorService extends BaseDAO {
  constructor(model) {
    super(model)
  }
}

module.exports = new VistorService(Vistor)
