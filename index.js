const forEach = require('lodash/forEach');

const Vertex = require('./helpers/vertex');

class Graphsonizer {
  constructor(id, data, schema, oldData, oldGraphson, options = { identifier: '_id' }) {
    const { types } = this.options;

    this.id = id;
    this.data = data;
    this.oldData = oldData;
    this.schema = schema;
    this.oldGraphson = oldGraphson;
    this.options = options;
    this.label = options.label || this.data.entityInfo.name;
    this.isUpdate = this.isOperationType();

    this.graphson = { vertices: [] };
    this.query = { delete: [], update: [], add: [] };

    this.types = types || {
      property: 'property',
      lookup: 'lookup',
      complex: 'complex',
    };

    this.generateGraphson();
    this.generateQuery();
  }

  isOperationType() {
    return this.oldData !== null;
  }

  generateGraphson() {
    this.createVertex();
  }

  createVertex(id, label, data, schema = this.schema) {
    const vertex = new Vertex(id, label);

    this.graphson.vertices.push(vertex);
    forEach(data, (value, index) => {
      const { [this.options.typeIdentifier || 'type']: type } = schema[index];

      if (type === 'property') {
        vertex.addProperty(index, value);
      } else if (type === 'lookup') {
        vertex.addOuterEdge(index, value);
      }
    });
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
