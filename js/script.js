/* Author:

*/

var current_price=38.00, shares=2138085037, users = 506000000, timerID, instagram_price =1000000000, jet_price = 65000000, zuck_salary = 1712362, harvard_tuition = 36305, winklevoss =14000000;
   
$(function()
{
  $(document).on("priceChecked",function(e, d){
    var seconds=new Date().getSeconds();
    seconds=Math.floor(parseInt(seconds)/5)*5;
    seconds=(seconds<10) ? "0"+seconds.toString() : seconds;
    var time=d.time.replace(/(AM|PM)/,":"+seconds);

    $("#time").text(time);
    if (current_price!=d.price){
      changePrice(current_price,d.price,20,100,2)
    }

    // new_worth=calculateWorth(current_price);
    // timerID=setInterval(updateWorth,50);
  });

  $(document).on("price/stock",function(e,d){
    changeValue('stock',d.price,'dollars');
  });

  $(document).on("price/stock",function(e,d){
    var user_price=calculateUserPrice(d.price);

    changeValue('user',user_price,'dollars');
    setTimeout(function(){
      $(document).trigger("price/user",[{price:user_price}])
    },1000);
  });

  $(document).on("price/user",function(e,d){
    changeValue('instagram',instagram_price/d.price,'users');
  });

  $(document).on("price/user",function(e,d){
    changeValue('jet',jet_price/d.price,'users');
  });
  $(document).on("price/user",function(e,d){
    changeValue('zuck',zuck_salary/d.price,'users');
  });

  $(document).on("price/user",function(e,d){
    changeValue('shares',(current_price*100)/d.price,'users')
  });

  $(document).on("price/user",function(e,d){
    changeValue('winklevoss',winklevoss/d.price,'users');
  });

  $(document).on("price/user",function(e,d){
    changeValue('harvard',(harvard_tuition*2)/d.price,'users')
  });
  
  $(document).trigger("price/stock",[{price:current_price}]);
  //getPrice();
  //setInterval(getPrice,5000);

});

function changeValue(sel,num,metric){
  var value;
  if(metric=="users"){
    value=addSpaces(num.toFixed(0));
  }
  if(metric=="dollars"){
    value=num.toFixed(2);
  }
  $("#"+sel).find("#value:eq(0)").text(value);
}

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
      $(document).trigger("priceChecked",[{price:data[0].l,time:data[0].ltt}])
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



