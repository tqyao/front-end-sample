window.addEventListener("load", function () {
    const arrowLef = document.querySelector(".arrow-l");
    const arrowRg = document.querySelector(".arrow-r");
    const focus = document.querySelector(".focus");
    const ul = focus.querySelector("ul");
    const ol = document.querySelector(".circle");
    const ulLis = ul.children;
    const liWidth = ulLis[0].offsetWidth;

    // 鼠标经过离开，左右小箭头显示隐藏
    focus.addEventListener("mouseenter", function () {
        arrowLef.style.display = "block";
        arrowRg.style.display = "block";
        clearInterval(interval);
        interval = num;
    })
    focus.addEventListener("mouseleave", function () {
        arrowLef.style.display = "none";
        arrowRg.style.display = "none";
        interval = setInterval(function () {
            arrowRg.click();
        }, 2000);
    })

    // 动态生成小圆圈，有几张焦点图就生成ol li
    for (let i = 0; i < ulLis.length; i++) {
        const li = document.createElement("li");
        li.dataset["index"] = i;
        ol.appendChild(li);
    }

    // 事件委托
    ol.addEventListener("click", function (e) {
        for (let i = 0; i < ol.children.length; i++) {
            ol.children[i].setAttribute("class", "");
        }
        const currentLi = e.target;
        const index = currentLi.dataset["index"];
        circle = num = index;   // 让点击小圆圈与左右切换轮播图点击事件关联
        currentLi.setAttribute("class", "current");
        animate(ul, -liWidth * index);
    })
    // 进入页面默认激活第一张焦点图
    ol.children[0].setAttribute("class", "current");

    // 克隆第一张焦点图，放置在焦点图末尾
    const firstFus = ulLis[0].cloneNode(true);
    ul.appendChild(firstFus);

    // 控制第几张焦点图
    let num = 0;
    // 控制激活第几个小圆圈
    let circle = 0;


    // 节流阀，点击先执行玩轮播动画，才能再次触发轮播
    let flag = false;

    // 左箭头轮播图切换
    arrowLef.addEventListener("click", function () {
        if (flag) return;
        flag = true;
        if (--num < 0) {
            ul.style.left = -(ulLis.length - 1) * liWidth + "px";
            num = ulLis.length - 2;
        }

        if (--circle < 0) {
            circle = ol.children.length - 1;
        }
        activeCircle();
        animate(ul, -liWidth * num, function () {
            flag = false;
        });
    })

    // 右箭头轮播图切换
    arrowRg.addEventListener("click", function () {
        if (flag) return;
        flag = true;
        if (++num > ulLis.length - 1) {
            ul.style.left = 0;
            num = 1;
        }
        if (++circle > ol.children.length - 1) {
            circle = 0;
        }
        activeCircle();
        animate(ul, -liWidth * num, function () {
            flag = false;
        });
    })

    function activeCircle() {
        for (let i = 0; i < ol.children.length; i++) {
            ol.children[i].setAttribute("class", "");
        }
        ol.children[circle].setAttribute("class", "current");
    }

    let interval = setInterval(function () {
        arrowRg.click();
    }, 2000);

})