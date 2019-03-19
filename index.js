const Graphsonizer = require('./helpers/graphsonizer');

module.exports = ({
  id,
  data,
  oldData,
  schema,
  oldGraphson,
  options,
}) => new Graphsonizer(id, data, schema, oldData, oldGraphson, options);
