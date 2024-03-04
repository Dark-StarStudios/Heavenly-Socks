const menu_button = document.getElementById("burger-menu");
const menu_panel = document.getElementById("burger-menu-panel");
const x = window.matchMedia("(min-width: 1000px)")
let key = false;

x.addEventListener("change", function() {
    if(x.matches){
        menu_panel.style.display = "none";
        key = false;
    }
  }); 
function Panel(){
    if(key){
        menu_panel.style.display = "none";
        return key = false;
    }else{
        menu_panel.style.display = "grid";
        return key = true;
    }
}
menu_button.addEventListener("click",Panel);