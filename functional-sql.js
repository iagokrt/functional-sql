function groupBy(executeData, groupByFns) {
  if (!groupByFns.length) {
    return executeData;
  }
  const groupByFn = groupByFns.shift();
  const grouped = executeData.reduce((grouped, item) => {
    const key = groupByFn(item);
    grouped[key] = grouped[key] || [];
    grouped[key].push(item);
    return grouped;
  }, {});
  return Object.entries(grouped).map(([groupName, values]) => {
    return [ groupName, groupBy(values, groupByFns.slice()) ];
  });
}

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
  groupBy(...fns) {
    this.groupByFns = fns;
    return this;
  }

  execute() {
    let executeData = this.data.slice();
    if (typeof this.whereFn === 'function') {
      executeData = executeData.filter(this.whereFn);
    }
    if (this.groupByFns && this.groupByFns.length) {
      executeData = groupBy(executeData, this.groupByFns.slice());
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
