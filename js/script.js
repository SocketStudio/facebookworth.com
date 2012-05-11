/* Author:

*/

var worth=0, new_worth=0, current_price=0, shares=102420000, users=150000000, timerID;
   
   $(document).ready(function()
    {
      getPrice();
      setInterval(getPrice,5000);
    });

   function getPrice(){
    $.ajax({
        type: "GET",
        url: "http://finance.google.com/finance/info?client=ig&q=NYSE:LNKD",
        dataType: "jsonp",
        success: function(data){
          current_price=data[0].l;
          new_worth=calculateWorth(current_price);
          timerID=setInterval(updateWorth,50);
        }
      });
   }

   function updateWorth(){
    var shares;
    if (worth!=new_worth){
      worth=ease(worth,new_worth);
      if (Math.abs(new_worth-worth)==0.01) worth=new_worth;
      $("#current_price").text(current_price);
      $("#worth").text(worth);
    }
    else{
      clearInterval(timerID);
    }
  }

    function ease(start,end){
      var change;
      change=(end-start)/2;
      change=Math.round(change*100)/100;
      start+=change;
      return Math.round(start*100)/100;
    }

    function calculateWorth(price){
      var market_cap,price_per_user;
      market_cap=price*shares;
      price_per_user=market_cap/users;
      return Math.round(price_per_user*100)/100;
    }

//150M linked in users
//102.42M linked in shares



