
var db=require('../confg/connection')
var collection=require('../confg/collections')
module.exports={
    
    addProduct:(product,callback)=>{
        console.log(product);

        db.get().collection('product').insertOne(product).then((data)=>{
              
            callback(data.ops[0]._id)
        })

    },

    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    }
}