let that = null;

class Tab {
    constructor(id) {
        that = this;
        this.tab = document.querySelector(id);
        this.tabList = this.tab.querySelector(".tablist");
        this.ul = this.tabList.querySelector("ul");
        this.tabCon = this.tab.querySelector(".tabcon");
        this.addBtn = this.tabList.querySelector(".add_btn");
        this.addBtn.addEventListener("click", this.addTab);
        this.init();
    }

    init() {
        this.updateNode();
        for (let i = 0; i < this.lis.length; i++) {
            this.lis[i].dataset["index"] = i;
            this.lis[i].addEventListener("click", this.toggoleTab);
            this.reduceBtn[i].addEventListener("click", this.removeTab);
            this.spans[i].addEventListener("dblclick", this.editCon2);
            this.sections[i].addEventListener("dblclick", this.editCon2);
        }
    }

    updateNode() {
        this.lis = this.ul.children;
        this.sections = this.tabCon.children;
        this.reduceBtn = this.ul.querySelectorAll(".reduce_btn");
        this.spans = this.ul.querySelectorAll("li span:first-child");
    }

    clearAlive() {
        for (let i = 0; i < this.sections.length; i++) {
            this.sections[i].style.display = "none";
        }
        const activeLi = this.ul.querySelector("li[class^='active']");
        activeLi && activeLi.classList.remove("active");
    }

    toggoleTab() {
        that.clearAlive();
        this.classList.add("active");
        that.sections[this.dataset["index"]].style.display = "block"
    }

    addTab() {
        // <li className="active"><span>测试1</span><span className="iconfont icon-guanbi reduce_btn"></span></li>
        that.clearAlive();
        that.ul.insertAdjacentHTML("beforeend", `<li class=\"active\"><span>新增测试</span><span class=\"iconfont icon-guanbi reduce_btn\"></span></li>`);
        that.tabCon.insertAdjacentHTML("beforeend", `<section style="display: block">测试${Math.random()}</section>`);
        that.init();
    }

    removeTab(e) {
        e.stopPropagation();
        let idx = this.parentNode.dataset["index"];
        this.parentNode.remove();
        that.sections[idx].remove();
        that.init();

        if (that.ul.querySelector(".active") || that.lis.length === 0) return;
        idx = idx < 0 ? 0 : --idx;
        that.lis[idx].click();
    }

    editCon() {
        // 清除双击文本选中
        window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty();
        const val = this.innerHTML
        this.style.display = "none";
        this.parentNode.insertAdjacentHTML("beforeend", `<input type="text" value=${val}>`);

        const inp = that.tab.querySelector("input");
        const _that = this;
        // console.log("this -> %o",this)
        // console.log("inp -> %o",this.querySelector("input"));
        // inp.focus();
        inp.select();
        inp.addEventListener("blur", function () {
            _that.innerHTML = this.value ? this.value : val;
            _that.style.display = "block";
            this.remove();
        })
        inp.addEventListener("keyup", function (e) {
            console.log(e.code);
            if (e.code === "Enter") this.blur();
        })
    }

    editCon2() {
        // 禁止双击文本选中
        window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty();
        let val = this.innerHTML;
        this.innerHTML = `<input type='text' value='${val}'>`;
        const inp = this.children[0];
        inp.select();

        inp.addEventListener("blur", function () {
            val = this.value ? this.value : val;
            this.parentNode.innerHTML = val;
        })
        inp.addEventListener("keyup", function (e) {
            if (e.code === "Enter") this.blur();
        })
    }

}

const tab = new Tab("#tab");
