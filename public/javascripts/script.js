const { response } = require("express")

function addToCart(proId){
    $.ajax({
      url:'/add-to-cart/'+proId,
      method:'get',
      success:(Response)=>{
          if(response.status){
              let count=$('#cart-count').hrml()
              count=parseInt(count)+1
              $("#cart-count").html(count)
          }
        alert(Response)
      }
    })
  }