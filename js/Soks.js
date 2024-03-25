    const nameSoks = document.getElementById("Soks");
    // const selectQuantity = ;
    // const selectMaat = ;
    const Prijs = document.getElementById("prijs");

    function getCookie(name) {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return "";
    }

    function naarWinkelmand(){
        const selectQuantity = document.getElementById("quantity").options[document.getElementById("quantity").selectedIndex].value;
        const selectMaat = document.getElementById("size").options[document.getElementById("size").selectedIndex].value;

        for(let i=0;i<=10;i++){
            if(!getCookie("GoederNaam"+i) && !getCookie("Quantity"+i) &&
            !getCookie("Maat"+i) && !getCookie("Prijs"+i)){
                document.cookie = "GoederNaam"+i+"="+nameSoks.innerHTML+"; path=/";
                document.cookie = "Quantity"+i+"="+selectQuantity+"; path=/";
                document.cookie = "Maat"+i+"="+selectMaat+"; path=/";
                document.cookie = "Prijs"+i+"="+Prijs.innerHTML+"; path=/";
                return console.log("Succses");
            }
        }
        
    }