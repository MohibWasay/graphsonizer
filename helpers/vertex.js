const Property = require('./property');
const OuterEdge = require('./outerEdge');
const InnerEdge = require('./innerEdge');

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
    const outerEdges = this.outE[`has_${property}`];
    if (outerEdges) {
      outerEdges.push(new OuterEdge(id, inV, properties));
    } else {
      this.outE[`has_${property}`] = [new OuterEdge(id, inV, properties)];
    }
  }

  addInnerEdge(property, id, outV, value, properties = {}) {
    const innerEdges = this.inE[`has_${property}`];
    if (innerEdges) {
      innerEdges.push(new InnerEdge(id, outV, properties));
    } else {
      this.inE[`has_${property}`] = [new InnerEdge(id, outV, properties)];
    }
  }
}

module.exports = Vertex;
