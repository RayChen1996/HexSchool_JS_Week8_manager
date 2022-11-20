
$(function(){
  GetProductList()
  // ShowMyCart()
})

const api_path = 'raychen'
const token = "zjRahQTiUTdZHg18y4XB5gv1Ort2"

let PData = []
let CartArr = []

function GetProductList(){
  console.log(`api_path  ${api_path}`)
  //https://livejs-api.hexschool.io/api/livejs/v1/admin/raychen/orders
  let url = `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`
  url = "https://livejs-api.hexschool.io/api/livejs/v1/admin/raychen/orders"
  console.log(`GetProductList  ${url}`)
 
  axios.get(url,{
    headers: {
      'Authorization': token
    }
  })
  .then(function (response) {
    // 成功會回傳的內容
    // console.log(response);
    let data = response.data
    console.log(data);
    PData = data.products
    if(data.status)
       RenderProductData(data.orders)
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  })



}
 
 

//更新我的購物車列表
function ReRenderMyCart(PDArr){
  const CartTbl = document.querySelector('.shoppingCart-table')
 
  let myCartHTML = ``
  if(PDArr.carts.length==0){

  }else{
    PDArr.carts.forEach((pItemObj,pIdx)=>{
      
      myCartHTML += `
        <tr>
          <td>
              <div class="cardItem-title">
                  <img src="${pItemObj.product.images}" alt="">
                  <p>${pItemObj.product.title}</p>
              </div>
          </td>
          <td>NT$${pItemObj.product.origin_price}</td>
          <td>1</td>
          <td>NT$${pItemObj.product.price}</td>
          <td class="discardBtn">
              <a onclick=DelSingleCart("${pItemObj.id}") href="#javascript:;" class="material-icons">
                  clear
              </a>
          </td>
        </tr>  
      `
      
    })    
  }
  CartTbl.innerHTML =  myCartHTML 
}


// 刪除購物車內特定產品
function DelSingleCart(pid){
  //'https://livejs-api.hexschool.io/api/livejs/v1/admin/raychen/carts/jw1jNknjVsKYPNyqYSWA'
  // console.log(`delete at  ${pid}`)
  //https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/carts/jw1jNknjVsKYPNyqYSWA
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/carts/${pid}`).
    then(function (response) {
      console.log(response.data);
   
      ReRenderMyCart(response.data.orders)
  })


}

//清除購物車內全部產品
function DelAllCart(){
  //https://livejs-api.hexschool.io/api/livejs/v1/admin/raychen/carts
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/carts`).
    then(function (response) {
      console.log(response.data);
      //重新渲染一次List  carts
     
      ReRenderMyCart(response.data.orders)
  })

}

function UpdateOrdersData(){
  //https://livejs-api.hexschool.io/api/livejs/v1/admin/raychen/orders
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {
    //帶入的值會使用物件包裝
    "data": {
      "user": {
        "name": document.getElementById("customerName"),
        "tel": document.getElementById("customerPhone"),
        "email": document.getElementById("customerEmail"),
        "address": document.getElementById("customerAddress"),
        "payment": $("#tradeWay").val()
      }
    }
  })
  .then(function (response) {
    // 成功會回傳的內容
    let data = response.data
    console.log(response)
    ReRenderMyCart(response.data.orders)

  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });


}

function deleteAtOrderSingle(orderId){
  console.log(`delete at ${orderId}`);
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
      ReRenderMyCart(response.data.orders)
      //重新渲染列表

  })  
}


function deleteAllOrder(){
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
      ReRenderMyCart(response.data.orders)
      //重新渲染列表

  })
}


function RenderProductData(ProductArr){
  console.log(ProductArr)
  var HTMLStr = ""
  let list_Product = document.querySelector('.orderPage-table')
  HTMLStr +=`
      <thead>
        <tr>
          <th>訂單編號</th>
          <th>聯絡人</th>
          <th>聯絡地址</th>
          <th>電子郵件</th>
          <th>訂單品項</th>
          <th>訂單日期</th>
          <th>訂單狀態</th>
          <th>操作</th>
        </tr>
      </thead>
  `
  ProductArr.forEach((item,index)=>{
    // console.log(item)
    // console.log(item.user)
    let payState = ""
    payState = item.paid == true ? "已處理":"未處理" 
    payState = "未處理" 
    HTMLStr += `
        <tr>
          <td>${item.id}</td>
          <td>
            <p>${item.user.name}</p>
            <p>${item.user.tel}</p>
          </td>
          <td>${item.user.address}</td>
          <td>${item.user.email}</td>
          <td>
            <p>${item.products[0].title}</p>
          </td>
          <td>2021/03/08</td>
          <td class="orderStatus">
            <a href="#javascript:;" onclick=ChangePayState("${payState}","${item.id}") >
               ${payState}
            </a>
          </td>
          <td>
            <input type="button" onclick=deleteAtOrderSingle("${item.id}") class="delSingleOrder-Btn" value="刪除">
          </td>
        </tr>    
    `
  })
  list_Product.innerHTML=HTMLStr
}

function ChangePayState(payState,OrderIdx){
  let Ispaid = false
  if(payState=="已處理"){
    Ispaid = true
  }
  axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      "data": {
        "id": OrderIdx,
        "paid": Ispaid
      }
    },
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
      ReRenderMyCart(response.data.orders)
      //ReRender List
    })

}






// C3.js
let chart = c3.generate({
  bindto: '#chart', // HTML 元素綁定
  data: {
      type: "pie",
      columns: [
      ['Louvre 雙人床架', 1],
      ['Antony 雙人床架', 2],
      ['Anty 雙人床架', 3],
      ['其他', 4],
      ],
      colors:{
          "Louvre 雙人床架":"#DACBFF",
          "Antony 雙人床架":"#9D7FEA",
          "Anty 雙人床架": "#5434A7",
          "其他": "#301E5F",
      }
  },
});
