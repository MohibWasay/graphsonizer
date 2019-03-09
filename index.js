const forEach = require('lodash/forEach');

const Vertex = require('./helpers/vertex');
const Property = require('./helpers/property');

class Graphsonizer {
  constructor(id, data, schema, oldData, oldGraphson, options = { identifier: '_id' }) {
    this.id = id;
    this.data = data;
    this.oldData = oldData;
    this.schema = schema;
    this.oldGraphson = options;
    this.options = options;
    this.label = options.label || this.data.entityInfo.name;
    this.isUpdate = this.isOperationType();
    this.generateGraphson();
    this.generateQuery();
  }

  isOperationType() {
    return this.oldData !== null;
  }

  generateGraphson() {
    this.createVertex();
    console.log(this);
  }

  createVertex(id, label, data, schema = this.schema) {
    const properties = [];
    const outerEdges = [];
    const innerEdges = [];

    forEach(data, (value, index) => {
      const { [this.options.typeIdentifier || 'type']: type } = schema[index];

      if (type === 'property') {
        properties.push(new Property(value));
      }
    });

    return new Vertex(id, label, outerEdges, innerEdges, properties);
  }

  generateQuery() {
    console.log(this);
  }

  getGraphson() {
    return this.graphson;
  }

  getQuery() {
    return this.query;
  }
}

module.exports = ({
  data,
  oldData,
  schema,
  oldGraphson,
  options,
}) => new Graphsonizer(data, schema, oldData, oldGraphson, options);
