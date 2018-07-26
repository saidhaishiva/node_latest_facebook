var app = angular.module('mainController',['authServices'])
    
app.controller('mainCtrl', function ($location,$timeout,Auth,$rootScope) {
    var appData=this;
	//console.log(Auth.isLoggedIn());
	appData.loadme = false;
	$rootScope.$on('$routeChangeStart',function(){
		
		if(Auth.isLoggedIn()){
			appData.isLoggedIn =true;
			Auth.getUser().then(function(data){
			//console.log(data.data.userName);
				appData.username = data.data.userName;
				appData.useremail = data.data.email;
				appData.loadme = true;
			});
		}
		else{
			appData.username = "";
			appData.isLoggedIn =false;
			appData.loadme = true;
		}
	});
	
    this.doLogin = function(loginData){
        appData.loading=true;
        appData.errorMsg= false;

        Auth.login(appData.loginData).then(function(data){
            
            if(data.data.success){
                appData.loading=false;
                appData.successMsg = data.data.message+"...Taking to Dash Board!";
                $timeout(function(){
                    $location.path('/about');
					appData.loginData = "";
					appData.successMsg = false;
                }, 2000);
            }else{
                appData.loading=false;
                appData.errorMsg = data.data.message;
            }
        });
    };
	
	this.logout = function(){
		Auth.logout();
		$location.path('/logout');
		$timeout(function(){
				$location.path('/');
		},2000);
	};

});