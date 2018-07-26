
var app=angular.module('userServices',[])

app.factory('User',function($http){
    userFactory = {};

    userFactory.create = function(userData){
       return  $http.post('/api/users',userData);
    }
    return userFactory;

    
})