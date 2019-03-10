const Property = require('./property');
const OuterEdge = require('./outerEdge');

class Vertex {
  constructor(id, label, outE = {}, inE = {}, properties = {}) {
    this.id = id;
    this.label = label;
    this.outE = outE;
    this.inE = inE;
    this.properties = properties;
  }

  addProperty(property, value) {
    this.properties[property] = [new Property(value)];
  }

  addOuterEdge(property, id, inV, value, properties = {}) {
    this.outE[`has_${property}`] = [new OuterEdge(id, inV, properties)];
  }
}

module.exports = Vertex;
