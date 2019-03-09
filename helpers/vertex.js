class Vertex {
  constructor(id, label, outE, inE, properties) {
    this.id = id;
    this.label = label;
    this.outE = outE;
    this.inE = inE;
    this.properties = properties;
  }
}

module.exports = Vertex;
