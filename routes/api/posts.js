const express = require('express');
const router = express.Router();

//@route GET api/posts
// @access Public

router.get('/',(req,res)=>res.send('Posts Router'));

module.exports = router;