var express = require('express');
var router = express.Router();
const productHelper=require('../helpers/product-helpers')

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

module.exports = router;
