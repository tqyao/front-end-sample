function animation(obj, target, callback) {
    clearInterval(obj.timer) // 避免多次调用生成多个定时器，导致动画'加速'
    // todo: 多次调用，timer属性被是否被覆盖？
    //  obj.timer 确实会被覆盖，但是定时器确确实实被创建，在处在内存中
    obj.timer = setInterval(function () {
        let step = (target - obj.offsetLeft) / 10;
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        if (obj.offsetLeft === target) {
            clearInterval(obj.timer);
            if (callback) callback();
            return;
        }
        obj.style.left = obj.offsetLeft + step + "px";

    }, 15)
}