function animate(obj, target, callback) {
    if (obj.timer) clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        if (target == obj.offsetLeft) {
            clearInterval(obj.timer);
            obj.timer = null;
            callback && callback();
            return;
        }
        // easy-out 运动曲线步长
        let step = (target - obj.offsetLeft) / 10;
        // 目的让obj精准移动到target位置
        step = step < 0 ? Math.floor(step) : Math.ceil(step);
        obj.style.left = obj.offsetLeft + step + "px";
    }, 15)
}