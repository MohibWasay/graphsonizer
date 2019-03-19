const Edge = require('./edge');

class InEdge extends Edge {
  constructor(id, outV, properties) {
    super(id, properties);
    this.outV = outV;
  }

  setOutV(outV) {
    this.outV = outV;
  }
}

module.exports = InEdge;
