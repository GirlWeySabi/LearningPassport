const connection = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const register = async (req, res)=>{

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const data = req.body;

    data.password = hash; //ARE THESE TWO NOT THE SAME??

   await connection.User.create(
        data        
    )

    res.json("registration successfully");

}
const login = async (req, res)=>{

    const email = req.body.email;
    const password = req.body.password;  //ARE THESE TWO NOT THE SAME?? meaning const password = hash
    // const data = req.body;

  const user = await connection.User.findOne({
       where:{
           email : email
        }
       });
    const showuser = await connection.User.findOne(
        {
            where: {
                email : email
            },
            attributes: { exclude: ['id','password','createdAt','updatedAt'] } 
        }
    );
       
    //    attributes : ['firstName','lastName','email']
    

   if (!user){
     return  res.json("you have to regiter first");
    }
    
    const checkPassword = bcrypt.compareSync(password, user.password); //the user.
    if (!checkPassword){
        return  res.json("your password is incorrect");
    } else {
        const payload = {
            id:user.id,
           }  
        
    
    const token = jwt.sign(payload, 'myVerySecret')
       res.json({
           "token" : token,
           "msg" : "login successfull",
           "user" : showuser,
           "statusCode" : 200
       });
    }
}

const getAllUsers = async (req, res)=>{
  const data = await connection.User.findAll();
    res.json(data);

}

const getOneUser = async (req, res)=>{
    const data = await connection.User.findOne({where: {id:req.user.id}});
      res.json(data);
  
  }


module.exports = {
    register,
    getAllUsers,
    login,
    getOneUser
    // loginWithPassport       
}
