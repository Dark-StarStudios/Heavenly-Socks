    const nameSoks = document.getElementById("Soks");
    // const selectQuantity = ;
    // const selectMaat = ;
    const Prijs = document.getElementById("prijs");

    // selectQuantity.addEventListener("change", function() {
    //     // Получаем выбранный вариант
    //     const selectedOption1 = selectQuantity.options[selectQuantity.selectedIndex].value;

    //     document.cookie = "Quantity=1; path=/";

    // });
    // selectMaat.addEventListener("change", function() {
    //     // Получаем выбранный вариант
    //     const selectedOption2 = selectMaat.options[selectMaat.selectedIndex].value;

    //     // Выводим выбранный вариант в консоль
    //     console.log("Выбран вариант:", nameSoks.innerHTML);
    //     console.log("Выбран вариант:", selectedOption2);
    // });

    function naarWinkelmand(){
        const selectQuantity = document.getElementById("quantity").options[document.getElementById("quantity").selectedIndex].value;
        const selectMaat = document.getElementById("size").options[document.getElementById("size").selectedIndex].value;

        document.cookie = "GoederNaam="+nameSoks.innerHTML+"; path=/";
        document.cookie = "Quantity="+selectQuantity+"; path=/";
        document.cookie = "Maat="+selectMaat+"; path=/";
        document.cookie = "Prijs="+Prijs.innerHTML+"; path=/";
        console.log("Succses");
    }