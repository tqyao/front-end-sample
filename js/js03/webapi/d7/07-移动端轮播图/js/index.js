window.addEventListener("load", function () {
    const focus = document.querySelector(".foucs");
    const ul = focus.querySelector("ul");
    let ol = focus.querySelector(".circle");

    function animateMove(translatex, isTransition) {
        ul.style.transition = isTransition ? "all .3s" : "none";
        ul.style.transform = "translateX(" + translatex + "px)"
    }

    // 动态生成 小圆圈
    for (let i = 0; i < ul.children.length; i++) {
        const liCreate = document.createElement("li");
        ol.appendChild(liCreate);
    }
    ol.children[0].classList.toggle("current");

    // 克隆第一张追加ul尾部用于无缝切换
    const firstLi = ul.children[0].cloneNode(true);
    ul.appendChild(firstLi);
    // 克隆第最后一张插入头部作为第一张用于用户触摸右移动屏幕
    const lastLi = ul.children[ul.children.length - 2].cloneNode(true);
    ul.insertBefore(lastLi, ul.children[0]);

    // 第逻辑上第几章轮播图索引：0~3（排除调clone的第一张）
    let focusIdx = 0;
    const offsetWidth = focus.offsetWidth;
    // 轮播定时器
    let timer = setInterval(function () {
        focusIdx++;
        //todo: 不清楚为什么一定要在过度完成后，不让实现不了无缝轮播
        //        if (focusIdx >= ul.children.length - 1) {
        //            focusIdx = 0;
        //            ul.style.transition = "none";
        //            ul.style.transform = `translateX(${-offsetWidth * focusIdx}px)`;
        //            // debugger
        //            focusIdx++;
        //        }

        // ul.style.transition = "all .3s";
        // ul.style.transform = `translateX(${-offsetWidth * focusIdx}px)`;
        animateMove(-offsetWidth * focusIdx, true);
    }, 2000)

    // 监听过度完成事件
    ul.addEventListener("transitionend", function () {
        if (focusIdx >= ul.children.length - 2) {
            focusIdx = 0;
            // ul.style.transition = "none";
            // ul.style.transform = `translateX(${-offsetWidth * focusIdx}px)`;
            // animateMove(-offsetWidth * focusIdx, false);
        } else if (focusIdx <= -1) {   // 用户在第一张焦点图左滑动
            focusIdx = ul.children.length - 3;
            // ul.style.transition = "none";
            // ul.style.transform = `translateX(${-offsetWidth * focusIdx}px)`;
        }
        animateMove(-offsetWidth * focusIdx, false);
        ol.querySelector(".current").classList.remove("current");
        ol.children[focusIdx].classList.add("current");
    })

    // 触摸时手指位置坐标 手指移动像素 ul触摸时的左偏移距离
    let startX = 0, moveX = 0;
    // 手指是否触摸移动
    let flag = false;
    ul.addEventListener("touchstart", function (e) {
        clearInterval(timer);
        startX = e.targetTouches[0].pageX;
    })
    ul.addEventListener("touchmove", function (e) {
        moveX = e.targetTouches[0].pageX - startX;
        // 原来盒子位置
        const translateX = -focusIdx * offsetWidth;
        // TODO 用户拖动不需要过度，但如果加了过度如何处理
        // ul.style.transition = "none";
        // ul.style.transform = `translateX(${translateX + moveX}px)`;
        animateMove(translateX + moveX, false);

        // 手指移动了
        flag = true;
        // 阻止滚动屏幕的行为
        e.preventDefault();
    })

    ul.addEventListener("touchend", function () {
        // 避免多个手指离开创建多个定时器
        clearInterval(timer);
        timer = setInterval(function () {
            focusIdx++;
            // ul.style.transition = "all .3s";
            // ul.style.transform = `translateX(${-offsetWidth * focusIdx}px)`;
            animateMove(-offsetWidth * focusIdx, true);

        }, 2000)

        // 如果手指只是触摸了焦点图没移动，就不做下面判断了
        if (!flag) return;

        if (Math.abs(moveX) >= 50) {//拖动距离大于50切换下一张
            if (moveX < 0) {// 拖动小于0，用户往从右往左拖动
                focusIdx++;
                // ul.style.transition = "all .3s";
                // ul.style.transform = `translateX(${-focusIdx * offsetWidth}px)`;
            } else {//拖动大于0，用户往从左往右拖动
                focusIdx--;
                // ul.style.transition = "all .3s";
                // ul.style.transform = `translateX(${-focusIdx * offsetWidth}px)`;
            }
        } else {
            // ul.style.transition = "all .3s";
            // ul.style.transform = `translateX(${-focusIdx * offsetWidth}px)`;
        }
        animateMove(-offsetWidth * focusIdx, true);
    })

    const goBack = document.querySelector(".go_back");
    const subNav = document.querySelector(".subnav_entry");
    document.addEventListener("scroll", function () {
        if (window.scrollY > subNav.offsetTop) {
            goBack.style.display = "block";
        } else {
            goBack.style.display = "none";
        }
    })
    goBack.addEventListener("click",function (){
        // document.style.transition = "all .3s"
        window.scroll(0,0);
    })

})