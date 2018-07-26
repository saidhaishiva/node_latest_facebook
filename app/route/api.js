
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'shivaraman';
module.exports = function(router) {

    //URL localhost:9090/api/users
    //For Registration Route Function
    router.post('/users',function (req,res) {
    var user = new User();
    user.userName =  req.body.userName;
    user.password = req.body.password;
    user.email = req.body.email;
    user.associateID = req.body.associateID;
    if(user.userName==null || user.userName==""|| user.email==null || user.email=="" || user.password==null || user.password=="" ||user.associateID==null || user.associateID==""){
            res.json({success:false,message:"Please Ensure all fields are filled with valid Data"});
    }else{
    user.save(function (err) {
        if(err){
            res.json({success:false,message:"User already Exists"});
            res.send("user not added bcoz -->"+err)
        }else{
            res.json({success:true,message:"Perfect! Your Registration is successful!!!"});
        }
    });
}  
});

    //For Login Route Function
    router.post('/authenticate',function (req,res) {
        User.findOne({associateID:req.body.associateID}).select('userName email password').exec(function (err,user) {
            if (err) {
                res.send(err);
            }

            if(req.body.password==null || req.body.password=="" ||req.body.associateID==null || req.body.associateID==""){
                res.json({success:false,message:"Please Enter both the associate ID  & Password"})
            }else{
            if(!user){
                res.json({success:false,message:"Oops! Your ID does not exist"})
            }else{
                var validPassword = user.comparePassword(req.body.password);
                if(!validPassword){
                    res.json({success:false,message:"Oops! Password you have entered is wrong."})
                }else{
                    console.log(user);
					var token = jwt.sign({ userName: user.userName, email:user.email },secret,{ expiresIn: '24h' });
					res.json({success:true,message:"User Authentication is successful",token: token});
					//console.log(token);
                }
            }
        }
        })
    });
	
	router.use(function (req,res,next) {
		//console.log(token+"token");
		var token = req.body.token || req.body.query || req.headers['x-access-token'];
		if(token){
			//verify token
			// verify a token symmetric
			//console.log(decoded);
			console.log(token);
			jwt.verify(token, secret, function(err, decoded) {
				console.log(decoded);
				if(err) {
					res.json({success:false,message:'Token invalid'});
				}else{
					req.decoded = decoded;
					next();
				}
			});

		}
		else{
			res.json({success:false,message:'No Token Provided'});
		}
	});
	
	router.post('/me',function (req,res) {
		//console.log(req.decoded);
		res.send(req.decoded);
	});

return router;
}
