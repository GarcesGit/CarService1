function animaionItem(i) {
    let itemsArray = document.getElementsByClassName("service-item-name");
    let item = itemsArray[i - 1];
    let itemWrapArr = document.getElementsByClassName("service-item");
    let itemWrap = itemWrapArr[i - 1];

    if (item.classList.contains("showNote")) {
        function removeText() {
            (function () {
                document.getElementById("service-note" + i).style.visibility = "hidden";
                document.getElementById("service-note" + i).style.left = "300px";
                document.getElementById("service-note" + i).style.transition = "1s";
            })();
            item.classList.remove("showNote");
            itemWrap.style.padding = "80px 0 0 0";
            itemWrap.style.transition = "1s";
        }
        setTimeout(removeText, 200);
    } else {
        item.classList.add("showNote");
        itemWrap.style.padding = "0px";
        itemWrap.style.transition = "1s";
        function text() {
            document.getElementById("service-note" + i).style.visibility = "visible";
            document.getElementById("service-note" + i).style.left = "0px";
            document.getElementById("service-note" + i).style.transition = "1s";
        }
        setTimeout(text, 200);
    }
}
