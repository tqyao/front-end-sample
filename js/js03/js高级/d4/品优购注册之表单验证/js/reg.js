window.addEventListener("load", () => {
    const tel = document.querySelector("#tel");
    const qq = document.querySelector("#qq");
    const nc = document.querySelector("#nc");
    const msg = document.querySelector("#msg");
    const pwd = document.querySelector("#pwd");
    const surepwd = document.querySelector("#surepwd");


    const datas = [
        {
            elem: tel,
            regExp: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            tips: {
                right: "手机号输入正确",
                mistake: "手机号输入错误"
            }
        },
        {
            elem: qq,
            regExp: /^\d{7,12}$/,
            tips: {
                right: "QQ号输入正确",
                mistake: "QQ号码输入错误"
            }
        },
        {
            elem: nc,
            regExp: /^\w{4,12}$/,
            tips: {
                right: "昵称合法",
                mistake: "输入错误，需要4-12位包括数字、字母、下划线的组合"
            }
        },
        {
            elem: msg,
            regExp: /^\d{5}$/,
            tips: {
                right: "合法验证阿妈",
                mistake: "验证码输入有误"
            }
        },
        {
            elem: pwd,
            regExp: /^\w{6,16}$/,
            tips: {
                right: "密码格式正确",
                mistake: "密码格式有误，6-16位 数字字母下划线的组合"
            }
        },
        // {
        //     elem: surepwd,
        //     regExp: /^\d{7,12}$/,
        //     tips: {
        //         right: "QQ号输入正确",
        //         mistake: "QQ号码输入错误"
        //     }
        // }
    ]
    // regExpForm();//error
    // regExpForm(datas[0].elem, datas[0].regExp, datas[0].tips);

    datas.forEach(item => {
        const {elem,regExp,tips} = item;
        console.log(elem)
        console.log(regExp);
        console.log(tips);
        regExpForm(item.elem, item.regExp, item.tips);
    })

    function regExpForm(elem, regExp, tips) {
        elem.addEventListener("blur", function () {
            const span = this.nextElementSibling;
            if (regExp.test(this.value)) {
                span.className = "success";
                span.innerHTML = `<i class="success_icon"></i>${tips.right}`;
                return;
            }
            span.className = "error";
            span.innerHTML = `<i class="error_icon"></i>${tips.mistake}`;
        })
    }

    surepwd.addEventListener("blur", function () {
        const span = this.nextElementSibling;
        let errorTip = "";
        if (/^\s*$/.test(this.value)) {
            errorTip = "确认密码不能为空";
        }
        else if (pwd.value === this.value) {
            span.className = "success";
            span.innerHTML = `<i class="success_icon"></i>确认密码输入正确`;
            return;
        } else {
             ;
        }
        span.className = "error";
        span.innerHTML = `<i class="error_icon"></i>${errorTip}`;
    })


})