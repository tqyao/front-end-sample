window.addEventListener("load", function () {
    const focus = document.querySelector(".foucs");
    const ul = focus.querySelector("ul");
    const ol = focus.querySelector(".circle");
    const offsetWidth = focus.offsetWidth;

    function animateMove(isTransition) {
        ul.style.transition = isTransition ? "all .3s" : "none";
        ul.style.transform = `translate(${-focusIdx * offsetWidth}px)`;
    }

    function moveByTranslate(translate, isTransition) {
        ul.style.transition = isTransition ? "all .3s" : "none";
        ul.style.transform = `translate(${translate}px)`;
    }

    for (let i = 0; i < ul.children.length; i++) {
        const createLi = document.createElement("li");
        ol.appendChild(createLi);
    }
    ol.children[0].classList.add("current");

    const firstFocus = ul.children[0].cloneNode(true);
    ul.appendChild(firstFocus);
    const lastFocus = ul.children[ul.children.length - 2].cloneNode(true);
    ul.insertBefore(lastFocus, ul.children[0]);

    let focusIdx = 0;
    let timer = setInterval(function () {
        focusIdx++;
        animateMove(true);
    }, 2000)

    ul.addEventListener("transitionend", function () {
        if (focusIdx >= ul.children.length - 2) {
            focusIdx = 0;
        }
        if (focusIdx < 0) {
            focusIdx = ul.children.length - 3;
        }
        animateMove(false);
        ol.querySelector(".current").classList.toggle("current");
        ol.children[focusIdx].classList.toggle("current");
    })

    let flag = false;
    let startX = 0, moveX = 0;
    ul.addEventListener("touchstart", function (e) {
        startX = e.targetTouches[0].pageX;
        clearInterval(timer)
        timer = null;
    })
    ul.addEventListener("touchmove", function (e) {
        flag = true;
        moveX = e.targetTouches[0].pageX - startX;
        // ul 原本的偏移
        const translatex = -focusIdx * offsetWidth;
        moveByTranslate(translatex + moveX);
        e.preventDefault();
    })
    ul.addEventListener("touchend", function (e) {
        clearInterval(timer);
        timer = setInterval(function () {
            focusIdx++;
            animateMove(true);
        }, 2000);

        if (!flag) return;
        if (Math.abs(moveX) > 50) {
            if (moveX < 0) {
                focusIdx++;
            } else {
                focusIdx--;
            }
        }
        animateMove(true);
    })

})