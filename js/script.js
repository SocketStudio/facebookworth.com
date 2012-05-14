/* Author:

*/

var current_price=0, shares=2138085037, users=901000000,
    timerID, instagram_price=1000000000, jet_price=65000000, zuck_salary=1712362,harvard_tuition=36305;
   
$(function()
{
  $(document).on("priceChecked",function(e, d){
    var new_price=d.price;
    if (current_price!=new_price){
      changePrice(current_price,new_price,20,50,2)
    }

    // new_worth=calculateWorth(current_price);
    // timerID=setInterval(updateWorth,50);
  });

  $(document).on("price/stock",function(e,d){
    (function(){$("#stock").text(d.price.toFixed(2))})();
  });

  $(document).on("price/stock",function(e,d){
    var user_price=calculateUserPrice(d.price);
    setTimeout(function(){$(document).trigger("price/user",[{price:user_price}])},1000);
    $("#user").text(user_price.toFixed(2));
  });

  $(document).on("price/user",function(e,d){
   $("#instagram").text(addSpaces((instagram_price/d.price).toFixed(0)));
  });

  $(document).on("price/user",function(e,d){
   $("#jet").text(addSpaces((jet_price/d.price).toFixed(0)));
  });
  $(document).on("price/user",function(e,d){
   $("#zuck").text(addSpaces((zuck_salary/d.price).toFixed(0)));
  });

  getPrice();
  setInterval(getPrice,5000);

});

function changePrice(start,end,steps,intervals,powr) { 
  var actStep = 0;
  if(window.timerID) {window.clearInterval(window.timerID);}
  window.timerID = window.setInterval(
    function() { 
      current_price = easeInOut(start,end,steps,actStep,powr);
      $(document).trigger("price/stock",[{price:current_price}]);
      actStep++;
      if (actStep > steps) {window.clearInterval(window.timerID); window.timerID=null;}
    } 
    ,intervals)
}

function easeInOut(minValue,maxValue,totalSteps,actualStep,powr) { 
  //Generic Animation Step Value Generator By www.hesido.com 
  var delta = maxValue - minValue; 
  var step = minValue+(Math.pow(((1 / totalSteps) * actualStep), powr) * delta); 
  return step;
} 


function getPrice(){
$.ajax({
    type: "GET",
    url: "http://finance.google.com/finance/info?client=ig&q=NASDAQ:MSFT",
    dataType: "jsonp",
    success: function(data){
      $(document).trigger("priceChecked",[{price:data[0].l}])
    }
  });
}

function calculateUserPrice(price){
  var market_cap,price_per_user;
  market_cap=price*shares;
  price_per_user=market_cap/users;
  return price_per_user;
}

function addSpaces(nStr){
  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ' ' + '$2');
  }
  return x1 + x2;
}



