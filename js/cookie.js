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

if(document.getElementById("table-winkelmand")){
    const table_winkelmand = document.getElementById("table-winkelmand");
    let TOTAAL = 0;
    let key = false;
    for(let i=0;i<=10;i++){
        if(getCookie("GoederNaam"+i) && getCookie("Quantity"+i) &&
            getCookie("Maat"+i) && getCookie("Prijs"+i)){
            key = true;
            table_winkelmand.innerHTML += "<tr><td>"+getCookie("GoederNaam"+i)+" "+getCookie("Maat"+i)+
            "</td><td>"+getCookie("Quantity"+i)+"</td><td>"+("€"+ (parseFloat((getCookie("Prijs"+i).replace("€", '')).replace(",", '.'))*parseInt(getCookie("Quantity"+i))).toFixed(2))+"</td></tr>";
            TOTAAL += parseFloat((getCookie("Prijs"+i).replace("€", '')).replace(",", '.'))*parseInt(getCookie("Quantity"+i));
        }   
    }
    key ? table_winkelmand.innerHTML += "<tr><th></th><th>Totaal:</th><th>€"+TOTAAL.toFixed(2)+"</th></tr>" : null;
    if(document.getElementById("text-Niks")){
        !key ? document.getElementById("text-Niks").style.display = "block" : document.getElementById("text-Niks").style.display = "none";
    }
    
}