const express = require('express');
const router = express.Router();
const {check,validationResult} =require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config')
const jwt = require('jsonwebtoken');

//@route post api/users
//@Desc Register Users
// @access Public

router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Enter valid email').isEmail(),
    check('password','Minimum length of 5').isLength({'min':6})
],
async (req,res)=>{
    const errors =validationResult(req);
    if(!errors.isEmpty()){
      return  res.status(400).json({errors:errors.array()})
    }
    const {name,email,password} = req.body;
    try{
        let user =await User.findOne({email});
        if(user){
            res.status(400).json({errors:[{msg:'User already Exists'}]});
        }
        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'

        })
       user = new User({
            name,email,
            avatar,
            password
        });
        
        
        
         const salt =await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);

       await user.save();
       const payload = {
           user:{
               id:user.id
           }
       }
       jwt.sign(payload,config.get('jwtToken'),
       {expiresIn : 360000},
       (err,token) =>{
           if(err) throw err
           res.json({token})
       }
       )
     

        // res.send('Users Registered');

    }catch(err){
      console.error (err.message);
      return res.status(500).send('Server Error');
    }
    // console.log(req.body);
     
});

module.exports = router;