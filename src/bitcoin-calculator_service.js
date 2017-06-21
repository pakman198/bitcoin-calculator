(function(){
	'use strict';

	angular.module('Bitcoin')
	.service('BitcoinService', BitcoinService)
	.constant('ApiBasePath', "https://apiv2.bitcoinaverage.com/constants/exchangerates/global");

	BitcoinService.$inject = ['$http', 'ApiBasePath'];
	function BitcoinService ($http, ApiBasePath){
		var service = this;
		
		service.fetchData = function(){
			return $http({
				method: "GET",
				url: (ApiBasePath)
			}).then(function(response){
				return response.data
				
			}).catch(function(e){
				console.log(e);
			});
		}
	}

})();