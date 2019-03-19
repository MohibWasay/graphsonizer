const forEach = require('lodash/forEach');

const Vertex = require('./vertex');

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

function uuid() {
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

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
      if (!schema[index]) {
        vertex.addProperty(index, value);
        return;
      }

      const { [this.options.typeIdentifier || 'type']: type } = schema[index];

      if (type === 'property') {
        vertex.addProperty(index, value);
      } else if (type === 'lookup') {
        if (schema[index].maxOcc > 1) {
          forEach(value, ({ _id, ...content }) => {
            vertex.addOuterEdge(index, uuid(), _id, content);
          });
        } else {
          const { _id, ...content } = value;
          vertex.addOuterEdge(index, uuid(), _id, content);
        }
      } else if (type === 'complex') {
        if (schema[index].maxOcc > 1) {
          forEach(value, ({ _id, ...content }) => {
            const relation = uuid();
            vertex.addOuterEdge(index, uuid(), _id, content);
            const childVertex = this.createVertex(_id, index, content, schema[index].props);
            childVertex.addInnerEdge(index, relation, _id, content);
          });
        } else {
          const { _id, ...content } = value;
          const relation = uuid();
          vertex.addOuterEdge(index, relation, _id, content);
          const childVertex = this.createVertex(_id, index, content, schema[index].props);
          childVertex.addInnerEdge(index, relation, _id, content);
        }
      }
    });

    return vertex;
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

module.exports = Graphsonizer;
