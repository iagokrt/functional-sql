class Query {
  select() {
    return this;
  }
  from(data) {
    this.data = data;
    return this;
  }
}

var query = function() {
  // select propertie
  return {
    select: () => {}
  };
  
};

module.exports = query;
