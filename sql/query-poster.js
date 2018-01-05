/**
 * http://usejsdoc.org/
 */
'use strict';

var http = require('http');

class QueryPoster {
	constructor() {
		this._http_client = http;
	}
	
	postQuery(json) {
		var post_headers = {
			host: 'blockbiarest.mybluemix.net',
			path: "/",
			method: "POST",
			headers: { 'Content-Type': 'application/json' }
		}
		
		var http_client = this._http_client;
		
		return new Promise(function(resolve, reject) {
			var req = http_client.request(post_headers, function(res) {
				var str = '';
				
		        if (res.statusCode < 200 || res.statusCode >= 300) {
		            // First reject
		            reject(new Error('statusCode=' + res.statusCode));
		            return;
		        }
				
				res.on('data', function(chunk) {
					str += chunk;
				});
				
				res.on('end', function(chunk) {
					resolve(str);
					return;
				});
				
				res.on('error', function(err) {
					reject(err);
					return;
				})
			});
			
			if(json) {
				req.write(json);
			}
			
			req.end();
		});
	}
}

module.exports = new QueryPoster();