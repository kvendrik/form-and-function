var chalk = require('chalk');

var MONTH_NAMES = [
	"January", "February", "March", "April", "May", "June",
  	"July", "August", "September", "October", "November", "December"
];

module.exports = {

	init: function(){
	},

	_getTimeStr: function(){
		var d = new Date();
		return chalk.blue('['+MONTH_NAMES[d.getMonth()]+' '+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+'] ');	
	},

	log: function(msg){
		console.log(this._getTimeStr()+msg);
	},

	success: function(msg){
		console.log(this._getTimeStr()+chalk.green(msg));
	},

	error: function(msg){
		console.error(this._getTimeStr()+chalk.red(msg));
	},

	warn: function(msg){
		console.warn(this._getTimeStr()+chalk.yellow(msg));
	}

};