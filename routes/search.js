/**
 * http://usejsdoc.org/
 */

var all_suppliers = require("../data/supplier.json");

exports.supplier = function(req, res) {
	if(req.query.starter) {		
		var filtered_suppliers = [];
		var starter = req.query.starter;
		
		all_suppliers.forEach(function(supplier) {
			if(starter.length > 0 && supplier.toLowerCase().startsWith(starter.toLowerCase())) {
				filtered_suppliers.push(supplier);
			}
		});
		
		res.send(JSON.stringify(filtered_suppliers));
	} else {
		res.send(JSON.stringify(all_suppliers));
	}
};
