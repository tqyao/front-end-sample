let that = null;

class Tab {
    constructor(id) {
        that = this;
        this.activeTab = 0;
        this.tab = document.querySelector(id);
        this.addBtn = this.tab.querySelector(".add");
        this.firstUl = this.tab.querySelector(".tab_list ul:first-child");
        this.reduceBtns = this.firstUl.querySelectorAll(".reduce");
        this.tabContent = this.tab.querySelector(".tab_content");
        this.addBtn.addEventListener("click", this.addTab);
        this.init();
    }

    init() {
        // console.log(this.firstUl.children.length);
        // console.log(this.reduceBtns.length);
        // console.log(this.tabContent.children.length);
        for (let i = 0; i < this.firstUl.children.length; i++) {
            this.firstUl.children[i].dataset["index"] = i;
            this.firstUl.children[i].addEventListener("click", this.toggleTab);
            // console.log(this.reduceBtns[i]);
            this.reduceBtns[i].addEventListener("click", this.removeTab);
            // todo: 此处this指向问题需要搞清楚
            const span = this.firstUl.children[i].firstElementChild;
            this.firstUl.children[i].firstChild.addEventListener("click", doubleClick(this.editTab.bind(span)));
            // this.f irstUl.children[i].addEventListener("click", doubleClick(this.editTab));
            const section = this.tabContent.children[i].firstChild;
            console.log(section)
            this.tabContent.children[i].firstChild.addEventListener("click",this.editTab.bind(section));

        }
    }

    initListener() {

    }

    clearChosen() {
        if (this.firstUl.children.length == 0) {
            return;
        }
        this.firstUl.querySelector(".current").classList.remove("current");
        for (let i = 0; i < this.tabContent.children.length; i++) {
            this.tabContent.children[i].style.display = "none";
        }
    }

    addTab() {
        that.clearChosen();
        that.firstUl.insertAdjacentHTML("beforeend",
            '<li class="current"><span>新建选卡</span><span class="iconfont icon-guanbi reduce"></span></li>');
        const section = document.createElement("section");
        section.style.display = "block";
        section.innerHTML = `测试 ${Math.random()}`;
        that.tabContent.appendChild(section);
        // 刷新
        that.reduceBtns = that.firstUl.querySelectorAll(".reduce");

        // const len = that.firstUl.children.length - 1;
        // that.firstUl.children[len].dataset["index"] = len;
        // that.firstUl.children[len].addEventListener("click", that.toggleTab);
        // that.reduceBtns[len].addEventListener("click", that.removeTab);
        that.init();
        that.activeTab = that.firstUl.children.length - 1;

    }


    removeTab(event) {
        // console.log("===")
        // console.log(this)
        // console.log("5555")
        // console.log(event)
        // console.log(this.parentNode);

        // 获取当前点击 删除按钮的父节点li的index值
        const index = this.parentNode.dataset["index"];
        // 删除 tablist 对应的 tabcont
        that.tabContent.removeChild(that.tabContent.children[index]);
        // console.log(that.firstUl.removeChild(this.parentNode));
        // 删除 tablist
        that.firstUl.removeChild(this.parentNode);
        event.stopPropagation();
        that.init(); // 重新编号

        if (index == that.activeTab && that.firstUl.children.length != 0) {
            const nowTabIdx = index - 1;    // 重新编号后的前一个li
            that.firstUl.children[nowTabIdx].classList.add("current");
            that.tabContent.children[nowTabIdx].style.display = "block";
            that.activeTab = nowTabIdx;
        }

    }

    toggleTab() {
        that.clearChosen();
        const index = this.dataset["index"];
        this.classList.add("current");
        that.tabContent.children[index].style.display = "block";
        that.activeTab = index;
    }

    editTab() {
        // console.log("editTab %o",this);
        // console.log(this.querySelector("span"));
        // console.log(this)




        // const span = this.querySelector("span");
        // let spanVal = span.innerHTML;
        // span.style.display = "none";

        let val = this.innerHTML;
        this.style.display="none";

        const inp = document.createElement("input");
        inp.value = val;
        this.parentNode.append(inp);
        inp.focus();

        const _that = this;
        inp.addEventListener("focus",function (e){
            // js input获取焦点后全选
            // console.log("++++++++++++++++========================================")
            // this.select();
            // console.log(e)
            // e.currentTarget.select();
        })
        inp.addEventListener("blur", function () {
            // console.log(this.value)
            _that.innerHTML = this.value;
            _that.style.display = "block";
            this.parentNode.removeChild(this);
        })
        inp.addEventListener("keyup",function (e) {
            if (e.code == "Enter") {
                _that.innerHTML = this.value;
                _that.style.display = "block";
                this.blur();
            }
        })
    }

}


const tab = new Tab("#tab");
console.log(tab);

function doubleClick(handle, await = 200, n = 2) {
    console.log("doubleClick %o", this);
    let count = 0;
    let timer = null;
    return function () {
        console.log("doubleClick return function  %o", this);
        if (!timer) {
            timer = setTimeout(() => {
                count = 0;
                timer = null;
            }, await);
        }
        count++;
        if (count === n) {
            handle(arguments);
            // handle.bind(this,arguments);
            count = 0;
            clearTimeout(timer);
            timer = null;
        }
    };
}

const h4 = document.querySelector("main h4");
h4.addEventListener("click", doubleClick(function () {
    console.log("双击了标题")
}))