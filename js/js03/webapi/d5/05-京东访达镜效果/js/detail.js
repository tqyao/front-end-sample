window.addEventListener("load", function () {
    const previewImg = document.querySelector(".preview_img");
    const mask = previewImg.querySelector(".mask");
    const bigPic = previewImg.querySelector(".big_pic");
    previewImg.addEventListener("mouseover", function (e) {
        mask.style.display = "block";
        bigPic.style.display = "block";
    })
    previewImg.addEventListener("mouseout", function () {
        mask.style.display = "none";
        bigPic.style.display = "none";
    })
    previewImg.addEventListener("mousemove", function (e) {
        // 鼠标在小框框中的坐标
        let x = e.pageX - this.offsetLeft;
        let y = e.pageY - this.offsetTop;


        let maskX = x - mask.offsetWidth / 2;
        let maskY = y - mask.offsetHeight / 2;

        // 在盒子内的最大移动距离
        let maxWidth = previewImg.offsetWidth - mask.offsetWidth;
        maskX = maskX < 0 ? 0 : maskX > maxWidth ? maxWidth : maskX;
        maskY = maskY < 0 ? 0 : maskY > maxWidth ? maxWidth : maskY;

        mask.style.left = maskX + "px";
        mask.style.top = maskY + "px";

        // 大图片移动距离 = 遮罩层移动距离 * 大图片移动最大距离 / 遮罩层移动最大距离
        let big = bigPic.children[0];
        let bigMax = bigPic.offsetWidth - big.offsetWidth;// 大图片移动最大距离
        let bigX = maskX * bigMax / maxWidth;
        let bigY = maskY * bigMax / maxWidth;
        big.style.left = bigX + "px";
        big.style.top = bigY + "px";

    })
})