(function(){
	'use strict';

	angular.module('Bitcoin', ['ngCookies'])
	.controller('BitcoinController', BitcoinController);

	BitcoinController.$inject = ['$filter', 'BitcoinService', '$cookies'];
	function BitcoinController ($filter, BitcoinService, $cookies){
		var ctrl = this;
		
		ctrl.MXN = 0,
		ctrl.USD = 0,
		ctrl.btc2usd = 0;
		ctrl.btc2mxn = 0;
		ctrl.current = 'BTC'
		
		
		ctrl.init = function(){
			//console.log('welcome');
			var cookie = ctrl.getCookie();
			if(!cookie){
				ctrl.getBTCPrice();
			}else{
				var data = ctrl.getCookieData();
				// console.log(data);
			}

		}
	  
		ctrl.getBTCPrice = function(){
			BitcoinService.fetchData().then(function(data){
				ctrl.MXN = data.rates.MXN.rate;
				var btc2usd = data.rates.BTC.rate;
				
				ctrl.BTC = 1 / btc2usd;
				ctrl.btc2mxn = ctrl.BTC * ctrl.MXN;
				ctrl.operationResult = ctrl.BTC * ctrl.MXN;
				
				ctrl.setCookie(ctrl.BTC, ctrl.MXN, ctrl.btc2usd, ctrl.btc2mxn);
			});
		}
	  
		ctrl.calculatePrice = function(amount){

			if(amount === 0 || amount === ''){
				console.log('amount vacio')
				if(ctrl.current === 'BTC'){
					ctrl.operationResult = ctrl.BTC * ctrl.MXN;   
				}else{
					ctrl.operationResult = 1 / (ctrl.BTC * ctrl.MXN);
					console.log('operationResult', ctrl.operationResult);
				}
				
				return;
			}

			if(ctrl.current === 'BTC'){
				ctrl.operationResult = ctrl.BTC * amount * ctrl.MXN;
				console.log(ctrl.operationResult)
			}else{
				ctrl.operationResult = amount / ctrl.btc2mxn;
			}
		}
	  
		ctrl.changeCurrency = function (){
			if(ctrl.current == 'MXN'){
				ctrl.current = 'BTC';
			}else{
				ctrl.current = 'MXN';
			}
			ctrl.amountInput = '';
			ctrl.calculatePrice(0);
		}

		ctrl.setCookie = function(BTC, MXN, btc2usd, btc2mxn){
			var date = new Date();
			var minutes = 15;
			date.setTime(date.getTime() + (minutes * 60 * 1000));
			$cookies.putObject(
				'BitcoinCalculator', 
				{
					'BTC' : BTC,
					'MXN' : MXN,
					'btc2usd' : btc2usd,
					'btc2mxn' : btc2mxn
				}, 
				{ expires: date }
			);
		}

		ctrl.getCookie = function(){
			return $cookies.get('BitcoinCalculator');
		}

		ctrl.getCookieData = function(){
			var data = $cookies.getObject('BitcoinCalculator');

			ctrl.BTC = data.BTC;
			ctrl.MXN = data.MXN;
			ctrl.btc2usd = data.btc2usd;
			ctrl.btc2mxn = data.btc2mxn;
			ctrl.operationResult = ctrl.BTC * ctrl.MXN;

			return data;
		}

		ctrl.init();
	}

})();