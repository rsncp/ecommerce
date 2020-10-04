var express = require('express');
const { response } = require('../app');
var router = express.Router();
const productHelper=require('../helpers/product-helpers')
const userHelpers=require('../helpers/user-helpres')

/* GET home page. */
router.get('/', function(req, res, next) {
  

  productHelper.getAllProducts().then((products)=>{

    console.log(products);
   res.render('user/view-products',{products})
 
  })
 
});

router.get('/login',(req,res)=>{
 res.render('user/login')
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
  })
})

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body)
})
module.exports = router;
