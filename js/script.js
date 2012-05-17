/* Author:

*/

var current_price=38.00, shares=2138085037, users = 506000000, timerID, instagram_price =1000000000, jet_price = 65000000, zuck_salary = 1712362, harvard_tuition = 36305, winklevoss =14000000;
   
$(function()
{
  $(document).on("priceChecked",function(e, d){
    var seconds=new Date().getSeconds();
    seconds=Math.floor(parseInt(seconds)/5)*5;
    seconds=(seconds<10) ? "0"+seconds.toString() : seconds;
    var time=(d.time.indexOf("4:00") == -1) ? d.time.replace(/(AM|PM)/,":"+seconds) : d.time;

    $("#time").text(time);
    
    if (current_price!=d.price){
      this.stock_timer=rampValue(current_price,d.price,this.stock_timer,"price/stock")
      current_price=d.price;
    }

    // new_worth=calculateWorth(current_price);
    // timerID=setInterval(updateWorth,50);
  });

  $(document).on("price/stock",function(e,d){
    
    var user_price=calculateUserPrice(d);
    changeValue('stock',d,'dollars');
    changeValue('user',user_price,'dollars');

    this.market_cap_timer=rampValue(getCurrentValue("how_many"),shares*current_price,this.market_cap_timer,"price/market_cap");

    setTimeout(function(){
      $(document).trigger("price/user",[{price:user_price}])
    },1000);
  });

  $(document).on("price/user",function(e,d){
    /*changeValue('instagram',instagram_price/d.price,'users');
    changeValue('jet',jet_price/d.price,'users');
    changeValue('zuck',zuck_salary/d.price,'users');
    changeValue('shares',(current_price*100)/d.price,'users')
    changeValue('winklevoss',winklevoss/d.price,'users');
    changeValue('harvard',(harvard_tuition*2)/d.price,'users')*/
    this.harvard_timer=rampValue(getCurrentValue("harvard"),harvard_tuition*2/d.price,this.harvard_timer,"users/harvard");
    this.instagram_timer=rampValue(getCurrentValue("instagram"),instagram_price*2/d.price,this.instagram_timer,"users/instagram");
    this.jet_timer=rampValue(getCurrentValue("jet"),jet_price*2/d.price,this.jet_timer,"users/jet");
    //this.harvard_timer=rampValue(parseInt($("#harvard").find("#value").text()),harvard_tuition*2/d.price,this.harvard_timer,"users/harvard");
  

  });
  
  $(document).on("users/harvard",function(e,d){
    changeValue('harvard',d,'users')
  });

  $(document).on("price/market_cap",function(e,d){
    changeValue('how_many',d,'users')
  });

  $(document).on("users/instagram",function(e,d){
    changeValue('instagram',d,'users')
  });

  $(document).on("users/jet",function(e,d){
    changeValue('jet',d,'users')
  });

  $(document).trigger("price/stock",[current_price]);
  getPrice();
  setInterval(getPrice,5000);

  //$(".span4").hover(function(){$(this).find("#value").css("opacity",1)},function(){$(this).find("#value").css("opacity",0)});

});
function getCurrentValue(sel){
  return parseInt($("#"+sel).find("#value").text().split(" ").join(""))
}

function changeValue(sel,num,metric){
  var value;
  if(metric=="users"){
    value=addSpaces(parseFloat(num).toFixed(0));
  }
  if(metric=="dollars"){
    value=parseFloat(num).toFixed(2);
  }
  $("#"+sel).find("#value:eq(0)").text(value);
}

function rampValue(start,end,timer,event) {
  start=parseFloat(start);
  end=parseFloat(end);
  var steps=20,intervals=100,powr=2;
  var actStep = 0;
  if(timer) {window.clearInterval(timer);}
  timer = window.setInterval(
    function() { 
      var current = easeInOut(start,end,steps,actStep,powr);
      
      $(document).trigger(event,[current]);
      actStep++;
      if (actStep > steps) {window.clearInterval(timer); timer=null;}
    } 
    ,intervals)
  return timer;
}

function easeInOut(minValue,maxValue,totalSteps,actualStep,powr) { 
  //Generic Animation Step Value Generator By www.hesido.com 
  var delta = maxValue-minValue; 
  var amount=(1 - Math.cos(actualStep/totalSteps * Math.PI)) / 2;

  var step=minValue+delta*amount;
  //var step = minValue+(Math.pow(((1 / totalSteps) * actualStep), powr) * delta); 
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



