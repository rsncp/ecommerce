var db=require('../confg/connection')
var collection=require('../confg/collections')
const bcrypt=require('bcrypt')  
const { ObjectID } = require('mongodb')
const { response } = require('express')
var objectId=require('mongodb').ObjectID

module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{

            userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{

          
            resolve(data.ops[0])
        })
        })
     
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(user){
                console.log(user.Password,"user.password")
                console.log(userData.Password,"userdata.password")
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    console.log(status)
                    if(status){
                        console.log("login success");
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log('login failed incorrectpassword');
                        resolve({status:false})
                    }
                })
            }else{
                console.log('login failed user not found');
                resolve({status:false})
            }
        })
    },
    addToCart:(proId,userId)=>{
        let proObj={
            item:objectId(proId),
            quantity:1
        }
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectID(userId)})
            if(userCart){
                let proExist=userCart.products.findIndex(product=> product.item==proId)
                console.log(proExist);

                        if(proExist!=-1){
                            db.get().collection(collection.CART_COLLECTION)
                            .updateOne({user:objectId(userId),'products.item':objectId(proId)},
                            {
                                $inc:{'products.$.quantity':1}
                            }
                          ).then(()=>{
                            resolve()
                        })
                        }else{

                db.get().collection(collection.CART_COLLECTION)
                .updateOne({user:objectId(userId)},
                     {
                         
                             $push:{products:proObj}
                         
                     }
                ).then((response)=>{
                    resolve()
                })
            }

            }else{
                let cartObj={
                    user:objectId(userId),
                    products:[proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    },
    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
            {
                $match:{user:objectId(userId)}
            },
            {
                $unwind:'$products'
            },
            {
                $project:{
                    item:'$products.item',
                    quantity:'$products.quantity'
                }
            },
            {
                $lookup:{
                    from:collection.PRODUCT_COLLECTION,
                    localField:'item',
                    foreignField:'_id',
                    as:'product'
                }
            },
            {
                $project:{
                    item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                }
            }
            
            ]).toArray()
           
            resolve(cartItems)
        })
    },
    getCartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let count=0;
        let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
        if(cart){
            count=cart.products.length
        }
        resolve(count)
        })
    }, 
    changeProductQuantity:(details)=>{
        console.log("tring this thing");
        details.count=parseInt(details.count)

        console.log(details);
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CART_COLLECTION)
            .updateOne({ _id:objectId(details.cart), 'products.item':objectId(details.product)},
            {
                $inc:{'products.$.quantity':details.count}
            }
          ).then((response)=>{
              console.log(response);
            resolve()
        })
        })
    }
}