var app = angular.module('userController',['userServices'])

app.controller('registrationCtrl', function ($http,$location,$timeout,User) {
    var appData=this;
    this.regUser = function(userData){
        appData.loading=true;
        appData.errorMsg= false;

        User.create(appData.userData).then(function(data){
            
            if(data.data.success){
                appData.loading=false;
                appData.successMsg = data.data.message+"...Taking to Dash Board!";
                $timeout(function(){
                    $location.path('/home');
                }, 2000);
            }else{
                appData.loading=false;
                appData.errorMsg = data.data.message;
            }
        })
    }

});