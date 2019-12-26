const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');


//@route GET api/profile/me
//@Desc Get current User Profile
// @access Private

router.get('/',auth, async (req,res)=>{
    try{
 const profile = await Profile.findOne({user:req.user.id}).populate('user',
 ['name','avatar']);

 if(!profile){
     res.status(500).json({msg:'Profile doesnt exist'})
 }
    }catch(err){
console.error(err.message);
res.status(500).send('Server Error')
    }
});

module.exports = router;