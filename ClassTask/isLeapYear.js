let year = 2024;

const isLeapYear = function(year){
	if(year % 4 === 0){
		return 'True';
	}else if(year % 100 === 0){
		return 'False';
	}else if(year % 400 === 0){
		return 'True';
	}
}

module.exports = isLeapYear