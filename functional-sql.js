function groupBy(executeData, groupByFns) {
  if (!groupByFns.length) {
    return executeData;
  }
  const groupByFn = groupByFns.shift();
  const groupTypes = {};
  const grouped = executeData.reduce((grouped, item) => {
    const key = groupByFn(item);
    groupTypes[key] = typeof key;
    grouped[key] = grouped[key] || [];
    grouped[key].push(item);
    return grouped;
  }, {});
  return Object.entries(grouped).map(([groupName, values]) => {
    if (groupTypes[groupName] === 'number') {
      groupName = Number(groupName);
    }
    
    return [ groupName, groupBy(values, groupByFns.slice()) ];
  });
}

class Query {
  constructor() {
    this.data = [];
    this.havingFns = [];

  }
  
  select(fn) {
    this.selectFn = fn;
    return this;
  }
  from(data) {
    this.data = data;
    return this; 
  }
  where(...fns) {
    this.whereFns = fns;
    return this;
  }
  groupBy(...fns) {
    this.groupByFns = fns;
    return this;
  }
  orderBy(fn) {
    this.orderByFn = fn;
    return this;
  }
  having(fn) {
    this.havingFns.push(fn);
    return this;
  }

  execute() {
    let executeData = this.data.slice();
    if (this.whereFns && this.whereFns.length) {
      executeData = executeData.filter(row => {
        return this.whereFns.some(fn => fn(row));
      });
    }
    if (this.groupByFns && this.groupByFns.length) {
      executeData = groupBy(executeData, this.groupByFns.slice());
    }
    if (this.havingFns && this.havingFns.length) {
      this.havingFns.forEach(fn => {
        executeData = executeData.filter(fn);
      });
    }
    if (typeof this.selectFn === 'function') {
      executeData = executeData.map(this.selectFn);
    }
    if (typeof this.orderByFn === 'function') {
      executeData = executeData.sort(this.orderByFn);
    }
    

    return executeData;
  }
}

module.exports = function query() {
  return new Query();
};
