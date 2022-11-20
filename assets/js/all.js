"use strict";

$(function () {
  GetProductList(); // ShowMyCart()
});
var api_path = 'raychen';
var token = "zjRahQTiUTdZHg18y4XB5gv1Ort2";
var PData = [];
var CartArr = [];

function GetProductList() {
  console.log("api_path  ".concat(api_path)); //https://livejs-api.hexschool.io/api/livejs/v1/admin/raychen/orders

  var url = "https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders");
  url = "https://livejs-api.hexschool.io/api/livejs/v1/admin/raychen/orders";
  console.log("GetProductList  ".concat(url));
  axios.get(url, {
    headers: {
      'Authorization': token
    }
  }).then(function (response) {
    // 成功會回傳的內容
    // console.log(response);
    var data = response.data;
    console.log(data);
    PData = data.products;
    if (data.status) RenderProductData(data.orders);
  })["catch"](function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
} //更新我的購物車列表


function ReRenderMyCart(PDArr) {
  var CartTbl = document.querySelector('.shoppingCart-table');
  var myCartHTML = "";

  if (PDArr.carts.length == 0) {} else {
    PDArr.carts.forEach(function (pItemObj, pIdx) {
      myCartHTML += "\n        <tr>\n          <td>\n              <div class=\"cardItem-title\">\n                  <img src=\"".concat(pItemObj.product.images, "\" alt=\"\">\n                  <p>").concat(pItemObj.product.title, "</p>\n              </div>\n          </td>\n          <td>NT$").concat(pItemObj.product.origin_price, "</td>\n          <td>1</td>\n          <td>NT$").concat(pItemObj.product.price, "</td>\n          <td class=\"discardBtn\">\n              <a onclick=DelSingleCart(\"").concat(pItemObj.id, "\") href=\"#javascript:;\" class=\"material-icons\">\n                  clear\n              </a>\n          </td>\n        </tr>  \n      ");
    });
  }

  CartTbl.innerHTML = myCartHTML;
} // 刪除購物車內特定產品


function DelSingleCart(pid) {
  //'https://livejs-api.hexschool.io/api/livejs/v1/admin/raychen/carts/jw1jNknjVsKYPNyqYSWA'
  // console.log(`delete at  ${pid}`)
  //https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/carts/jw1jNknjVsKYPNyqYSWA
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/carts/").concat(pid)).then(function (response) {
    console.log(response.data);
    ReRenderMyCart(response.data.orders);
  });
} //清除購物車內全部產品


function DelAllCart() {
  //https://livejs-api.hexschool.io/api/livejs/v1/admin/raychen/carts
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/carts")).then(function (response) {
    console.log(response.data); //重新渲染一次List  carts

    ReRenderMyCart(response.data.orders);
  });
}

function UpdateOrdersData() {
  //https://livejs-api.hexschool.io/api/livejs/v1/admin/raychen/orders
  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders"), {
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
  }).then(function (response) {
    // 成功會回傳的內容
    var data = response.data;
    console.log(response);
    ReRenderMyCart(response.data.orders);
  })["catch"](function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
}

function deleteAtOrderSingle(orderId) {
  console.log("delete at ".concat(orderId));
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders/").concat(orderId), {
    headers: {
      'Authorization': token
    }
  }).then(function (response) {
    console.log(response.data);
    ReRenderMyCart(response.data.orders); //重新渲染列表
  });
}

function deleteAllOrder() {
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders"), {
    headers: {
      'Authorization': token
    }
  }).then(function (response) {
    console.log(response.data);
    ReRenderMyCart(response.data.orders); //重新渲染列表
  });
}

function RenderProductData(ProductArr) {
  console.log(ProductArr);
  var HTMLStr = "";
  var list_Product = document.querySelector('.orderPage-table');
  HTMLStr += "\n      <thead>\n        <tr>\n          <th>\u8A02\u55AE\u7DE8\u865F</th>\n          <th>\u806F\u7D61\u4EBA</th>\n          <th>\u806F\u7D61\u5730\u5740</th>\n          <th>\u96FB\u5B50\u90F5\u4EF6</th>\n          <th>\u8A02\u55AE\u54C1\u9805</th>\n          <th>\u8A02\u55AE\u65E5\u671F</th>\n          <th>\u8A02\u55AE\u72C0\u614B</th>\n          <th>\u64CD\u4F5C</th>\n        </tr>\n      </thead>\n  ";
  ProductArr.forEach(function (item, index) {
    // console.log(item)
    // console.log(item.user)
    var payState = "";
    payState = item.paid == true ? "已處理" : "未處理";
    payState = "未處理";
    HTMLStr += "\n        <tr>\n          <td>".concat(item.id, "</td>\n          <td>\n            <p>").concat(item.user.name, "</p>\n            <p>").concat(item.user.tel, "</p>\n          </td>\n          <td>").concat(item.user.address, "</td>\n          <td>").concat(item.user.email, "</td>\n          <td>\n            <p>").concat(item.products[0].title, "</p>\n          </td>\n          <td>2021/03/08</td>\n          <td class=\"orderStatus\">\n            <a href=\"#javascript:;\" onclick=ChangePayState(\"").concat(payState, "\",\"").concat(item.id, "\") >\n               ").concat(payState, "\n            </a>\n          </td>\n          <td>\n            <input type=\"button\" onclick=deleteAtOrderSingle(\"").concat(item.id, "\") class=\"delSingleOrder-Btn\" value=\"\u522A\u9664\">\n          </td>\n        </tr>    \n    ");
  });
  list_Product.innerHTML = HTMLStr;
}

function ChangePayState(payState, OrderIdx) {
  var Ispaid = false;

  if (payState == "已處理") {
    Ispaid = true;
  }

  axios.put("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders"), {
    "data": {
      "id": OrderIdx,
      "paid": Ispaid
    }
  }, {
    headers: {
      'Authorization': token
    }
  }).then(function (response) {
    console.log(response.data);
    ReRenderMyCart(response.data.orders); //ReRender List
  });
} // C3.js


var chart = c3.generate({
  bindto: '#chart',
  // HTML 元素綁定
  data: {
    type: "pie",
    columns: [['Louvre 雙人床架', 1], ['Antony 雙人床架', 2], ['Anty 雙人床架', 3], ['其他', 4]],
    colors: {
      "Louvre 雙人床架": "#DACBFF",
      "Antony 雙人床架": "#9D7FEA",
      "Anty 雙人床架": "#5434A7",
      "其他": "#301E5F"
    }
  }
});
"use strict";

var api_path = 'raychen';
var token = "zjRahQTiUTdZHg18y4XB5gv1Ort2";
//# sourceMappingURL=all.js.map
