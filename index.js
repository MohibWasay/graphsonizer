const forEach = require('lodash/forEach');

const Vertex = require('./helpers/vertex');

class Graphsonizer {
  constructor(id, data, schema, oldData, oldGraphson, options = { identifier: '_id' }) {
    const { types } = options;

    this.id = id;
    this.data = data.body;
    this.oldData = oldData;
    this.schema = schema;
    this.oldGraphson = oldGraphson;
    this.options = options;
    this.label = options.label || data.header.entityInfo.name;
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
    this.createVertex(this.id, this.label, this.data);
  }

  createVertex(id, label, data, schema = this.schema) {
    const vertex = new Vertex(id, label);
    this.graphson.vertices.push(vertex);
    forEach(data, (value, index) => {
      console.log(index);
      const { [this.options.typeIdentifier || 'type']: type } = schema[index];

      if (type === 'property') {
        vertex.addProperty(index, value);
      } else if (type === 'lookup') {
        const { _id, ...content } = value;
        vertex.addOuterEdge(index, 'dfhdf03-4084f9-49080f4-49080fd', _id, content);
      } else if (type === 'complex') {
        const { _id, ...content } = value;
        vertex.addOuterEdge(index, 'dfhdf03-4084f9-49080f4-49080fd', _id, content);
        this.createVertex(_id, index, content, schema[index].props);
      }
    });
  }

  generateQuery() {
    this.query = null;
  }

  getGraphson() {
    return this.graphson;
  }

  getQuery() {
    return this.query;
  }
}

module.exports = ({
  id,
  data,
  oldData,
  schema,
  oldGraphson,
  options,
}) => new Graphsonizer(id, data, schema, oldData, oldGraphson, options);
