const Edge = require('./edge');

class OutEdge extends Edge {
  constructor(id, inV, properties) {
    super(id, properties);
    this.inV = inV;
  }

  setInV(inV) {
    this.inV = inV;
  }
}

module.exports = OutEdge;
