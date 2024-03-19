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
    table_winkelmand.innerHTML += "<tr><td>"+getCookie("GoederNaam")+" "+getCookie("Maat")+
    "</td><td>"+getCookie("Quantity")+"</td><td>"+getCookie("Prijs")+"</td></tr>";
}