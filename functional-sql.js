class Query {
  constructor() {
    this.data = [];
  }
  
  select(fn) {
    this.selectFn = fn;
    return this;
  }
  from(data) {
    this.data = data;
    return this; 
  }
  where(fn) {
    this.whereFn = fn;
    return this;
  }
  execute() {
    let executeData = this.data.slice();

    if (typeof this.whereFn === 'function') {
      executeData = executeData.filter(this.whereFn);
    }

    if (typeof this.selectFn === 'function') {
      executeData = executeData.map(this.selectFn);
    }
    return executeData;
  }
}

var query = function() {
  // select propertie: within instance
  return new Query();

};

module.exports = query;
