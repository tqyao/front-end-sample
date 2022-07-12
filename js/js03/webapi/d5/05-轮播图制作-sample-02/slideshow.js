window.addEventListener("load", function () {
    const focus = document.querySelector(".focus");
    const arrowLef = focus.querySelector(".arrow_lef");
    const arrowRg = focus.querySelector(".arrow_rg");
    const ul = focus.querySelector("ul");
    const circle = focus.querySelector(".circle");
    const focusWidth = focus.offsetWidth;
    focus.addEventListener("mouseenter", function () {
        arrowLef.style.display = "block";
        arrowRg.style.display = "block";
        clearInterval(timer);
        timer = null;
    })
    focus.addEventListener("mouseleave", function () {
        arrowLef.style.display = "none";
        arrowRg.style.display = "none";
        timer = setInterval(function () {
            arrowRg.click();
        },2000)
    })

    // 根据轮播图数列决定生成小圆圈数量
    for (let i = 0; i < ul.children.length; i++) {
        const createLi = document.createElement("li");
        createLi.dataset["index"] = i;
        circle.appendChild(createLi);
        // 方法一：排他思想，为每个circle添加点击事件
        // circle.children[i].addEventListener("click", function () {
        //     // 排他思想
        //     for (let i = 0; i < circle.children.length; i++) {
        //         circle.children[i].setAttribute("class", "");
        //     }
        //     this.setAttribute("class","current");
        // })
    }
    // 方法二：事件委托(原理：冒泡)
    circle.addEventListener("click", function (e) {
        const active = e.target;
        // 确保触发的不是 ol 而是 li 才赋值
        if (!active.dataset.index) return;
        for (let i = 0; i < circle.children.length; i++) {
            circle.children[i].setAttribute("class", "");
        }
        active.setAttribute("class", "current");
        const activeIdx = active.dataset["index"];
        num = choose = activeIdx;
        // console.log(-active.dataset["index"] * focusWidth);
        animate(ul, -activeIdx * focusWidth);
    })

    circle.children[0].className = "current"
    // 选中激活 circle 的索引
    let choose = 0;
    // 控制左右切换焦点图的步长因子
    let num = 0;
    // 克隆第一张焦点图，放置最后实现无缝衔接
    const first = ul.children[0].cloneNode(true);
    ul.appendChild(first);

    // 节流阀
    let flag = false;

    arrowRg.addEventListener("click", function () {
        if (flag) return;
        flag = true;
        // num 记录索引，当 ++num 索引等于长度值时，意味索引着已经越界，紧接下一张焦点图应该是第二张
        if (++num == ul.children.length) {
            ul.style.left = 0;
            num = 1;
        }
        animate(ul, -num * focusWidth, function () {
            flag = false;
        });
        if (++choose == circle.children.length) {
            choose = 0;
        }
        activeCircle();
    })

    arrowLef.addEventListener("click", function () {
        if (flag) return;
        flag = true;
        // num 记录索引，当 --num 索引等于-1时，意味着，用户是想从第1张焦点图切换到最后一张
        if (--num == -1) {
            num = ul.children.length - 1;
            ul.style.left = -num * focusWidth + "px";
            num--;//因为克隆了第一张焦点图，所以实际最后一张 ul.children.length - 2；
        }
        animate(ul, -num * focusWidth, function () {
            flag = false;
        });
        if (--choose == -1) {
            choose = circle.children.length - 1;
        }
        activeCircle();
    })

    function activeCircle() {
        for (let i = 0; i < circle.children.length; i++) {
            circle.children[i].className = "";
        }
        circle.children[choose].className = "current";
    }

    let timer = setInterval(function () {
        arrowRg.click();
    },2000)
})