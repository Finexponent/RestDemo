const express = require('express');
const {check,validationResult} =require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config')
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../../middleware/auth')
const User =require('../../models/User')

//@route GET api/auth
// @access Public

router.get('/',auth,async (req,res)=>{

    try{
const user = await User.findById(req.user.id).select('-password');
res.json(user);
    }catch(err){
console.error(err.message);
res.status(500).send('Server Error')
    }
});

// @route post api/auth

 router.post('/',[
    check('email','Enter valid email').isEmail(),
    check('password','Password is required').exists()
],
async (req,res)=>{
    const errors =validationResult(req);
    if(!errors.isEmpty()){
      return  res.status(400).json({errors:errors.array()})
    }
    const {email,password} = req.body;
    try{
        let user =await User.findOne({email});
        if(!user){
            res.status(400).json({errors:[{msg:'Invalid User'}]});
        }

        const isMatch =await bcrypt.compare(password,user.password);
        if(!isMatch){
            res.status(400).json({errors:[{msg:'Invalid User'}]});
        }
       
      
        
        
        
        

      
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
     


    }catch(err){
      console.error (err.message);
      return res.status(500).send('Server Error');
    }
   
});

module.exports = router;