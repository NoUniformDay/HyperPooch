'use strict';

class QueryBuilder {
    constructor() {
        this._select = [];
        this._where;
        this._other;
        this._group;
        this._aggregate;
        this._table = 'DEV01 LEFT JOIN DEV01_DATA_ITEMS ON DEV01.\"_ID\" = DEV01_DATA_ITEMS.\"_ID\"';
        this.date;
    }

    loadJSON(json) {
    	var that = this;
    	return new Promise(function(resolve, reject) {
        	if(json.group) {
        		that._group = json.group;
        	}

            if(json.select && Array.isArray(json.select)) {
                that._select = json.select;
            }

            if(json.where) {
                that._where = json.where;
            }

            if(json.other) {
                that._other = json.other;
            }

            if(json.agg) {
            	that._aggregate = json.agg;
            }

            if(json.date) {
              that.date = json.date;
            }

            resolve('SUCCESS LOAD JSON');
    	});
    }

    buildQuery() {
		var that = this;

    	return new Promise(function(resolve, reject) {
    		var sql = '';

		   if(that._group && Object.keys(that._group).length > 0) {
		    	if(that._group.supplier) {
		    		var group = 'DATA_SUPPLIER';
		    	}

		    	else if(that._group.recipient) {
		    		var group = 'DATA_RECIPIENT';
		       	}

		    	else {
		    		reject("Error: Group");
		    	}

		    	that.buildSelectWithGroup(group, that._aggregate.count).then(function(select_string) {
		    		sql += select_string

		    		return that._table;
		    	}).then(function(table_string) {
		    		sql += 'FROM ' + table_string;

		    		return that.buildWhere();
		    	}).then(function(where_string) {
            if(where_string.length > 0) {
              where_string = "WHERE " + where_string;
            }

		    		sql += where_string;

	    		  return that.buildGroup(group);
		    	}).then(function(group_string) {
		    		sql += group_string;

			    	return resolve(sql);
		    	});
		    } else {
		    	that.buildSelect().then(function(select_string) {
    		        sql += select_string;

    		        return that._table;
		    	}).then(function(table_string) {
		    		sql += table_string;

		    		return that.buildWhere();
		    	}).then(function(where_string) {
    		        sql += that.buildWhere();

    		        return resolve(sql);
		    	});
		    }
    	});
    }

    buildSelect() {
      var that = this;
    	return new Promise(function(resolve, reject) {
    		var select_part = 'SELECT ';

            if(that._select && that._select.length > 0) {
            	that._select.forEach(function(select_item, select_index, select) {

                	console.log(select_item.length);
                	console.log(select_item.length == 0);

                	if(select_item.length == 0) {
                		select_part += '* ';

                		return resolve(select_part);
                	}

                    select_part += select_item;

                    if(select_index < (select.length - 1)) {
                        select_part += ', ';
                    }
                });

                return select_part;
            }

            return reject('NO SELECT');
    	});
    }

    buildSelectWithGroup(group, aggregate) {
    	return new Promise(function(resolve, reject) {
        	if(aggregate) {
            	if(aggregate == 'many') {
            		return resolve('SELECT ' + group + ' AS OBJECT, COUNT(PRODUCT) AS AMOUNT ');
            	} else if(aggregate == 'much') {
            		return resolve('SELECT ' + group + ' AS OBJECT, SUM(QUANTITY) AS AMOUNT ');
            	}
        	}

    		return reject('NO AGGREGATE');
    	});
    }

    buildWhere() {
    	var that = this;

    	return new Promise(function(resolve, reject) {
            var where_part = 'WHERE';

            if(that._where && that._where > 0) {
            	Object.keys(this._where).forEach(function(where_key, where_index, where) {
                    where_part += where_key + ' = ' + where[where_key];

                    if(where_index < (where.length - 1)) {
                        where_part += ' AND ';
                    }
            	});

                return resolve(where_part);
            }

            return resolve('');
    	}).then(function(where_part) {
        var date_part = that.buildDate();

        if(where_part.length < 0) {
          return "WHERE " + date_part;
        } else {
          return date_part;
        }
      });
    }

    buildDate() {
      var that = this;

      return new Promise(function(resolve, reject) {
        var date_part = '';

        if(that.date) {
          switch(that.date.length) {
            case 0:
              return resolve(date_part);
            case 1:
              var the_date = new Date(Date.parse(that.date[0]));
              var now = new Date();

              if(the_date > now) {
                return reject("Error: Invalid Time");
              }

              date_part = "timestamp <= " + now.getTime() + " AND timestamp >= " + the_date.getTime();

              return resolve(date_part);
            case 2:
              var date_0 = new Date(Date.parse(that.date[0]));
              var date_1 = new Date(Date.parse(that.date[1]));

              var tmp_dates = date_0 > date_1 ? [date_0, date_1] : [date_1, date_0];

              var max_date = tmp_dates[0];
              var min_date = tmp_dates[1];

              date_part = "timestamp >= " + min_date.getTime() + " AND timestamp <= " + max_date.getTime();

              return resolve(date_part);
            default:
              return resolve(date_part);
          }
        }
      });
    }

    buildOther() {

    }

    buildGroup(group) {
    	return new Promise(function(resolve, reject) {
        	var group_part = '';

        	if(group) {
        		group_part = ' GROUP BY ' + group;

            	return resolve(group_part);
        	}

        	return resolve('');
    	});
    }
}

module.exports = new QueryBuilder();
