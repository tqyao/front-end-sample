console.log('helloword ^^');

// const tartgetUrl = "http://xsm.nfu.edu.cn/welcome/toselectroompage";
// if (location.href !== tartgetUrl) {
//     let timer = setInterval(() => {
//         location.assign(tartgetUrl);
//         timer && clearInterval(timer);
//     }, 1000);
// }

// if (location.href.indexOf('toselectroompage') <= -1) {
//     return;
// }
function getJson(url, param) {
    if (param) {
        url += '?';
        for (let key in param) {
            url += key + '=';
            url += param[key] + '&';
        }
        url = url.substring(0, url.length - 1);
    }
    console.log(url);
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url,
            headers: {"Content-Type": "application/json;charset=UTF-8"},
            responseType: "json",
            onload(res) {
                if (res.readyState === 4 && res.status === 200) {
                    console.log('请求成功');
                    const resp = res.response;
                    console.log(res);
                    console.log(resp)
                    resolve(resp);
                    return
                }
                console.error("请求失败，状态码非200");
                reject("请求失败，状态码非200");
            },
            onerror(error) {
                console.error('请求异常');
                reject(error);
            }
        })
    })
}

// 床位是否选择成功
let selected = false;
const baseUrl = "http://xsm.nfu.edu.cn";
let roomLabels = [];

// async function getRooms() {
//     return await getJson(baseUrl + "/welcome/selectroom/getlegalrooms", {
//         "ldid": 33,
//         "floor": 3,
//         "emptyFlag": 0,
//         "current": 1,
//         "pageSize": 10,
//     })
// }

// console.log(getRooms());


async function getBedroomsInfo() {
    const roomsRes = await getJson(baseUrl + "/welcome/selectroom/getlegalrooms", {
        "ldid": 33,
        "floor": 3,
        "emptyFlag": 0,
        "current": 1,
        "pageSize": 10,
    });

    if (roomsRes.code === 0) {   // 0 查询楼层房间成功
        // 用房号查询房间信息
        const {rooms} = roomsRes;
        if (rooms != null) {
            let allPromise = [];
            rooms.forEach(item => {
                const {ldid, fjh: room} = item;
                allPromise.push(getJson(baseUrl + "/welcome/selectroom/getlegalbeds", {ldid, room}))
            })
            return await Promise.allSettled(allPromise);
        }
    }
}


// async function getAsyncRes() {
//     debugger;
//     let s = await getBedroomsInfo();
//     console.log(s)
// }
// getAsyncRes();
// let results = await getBedroomsInfo();

getBedroomsInfo().then(results => {
    // console.log(res)
    console.log("===")
    console.log(results)
    const bedrooms = results.filter(item => item.status === 'fulfilled').map(item => item.value);
    console.log(bedrooms);

    document.body.insertAdjacentHTML('beforeend', `<div id="grabBed" style="
\t\t\tposition: fixed;
\t\t\ttop: 50%;
\t\t\tleft: 50%;
\t\t\ttransform: translate(-50%,-50%);
\t\t\twidth: 500px;
\t\t\tpadding: 50px 0;
\t\t\tbackground-color: rgba(0,0,0,.1);">
\t\t<table align="center" width="300" border="1">
\t\t\t<thead>
\t\t\t\t<tr>
\t\t\t\t\t<th>房间号</th>
\t\t\t\t\t<th>床位号</th>
\t\t\t\t</tr>
\t\t\t</thead>
\t\t\t<tbody class="room_bd">
\t\t\t</tbody>
\t\t</table>
\t</div>`);

    const grabBedDiv = document.querySelector("#grabBed");
    const roomBd = document.querySelector(".room_bd");
    bedrooms.forEach(room => {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const {fjh} = room[0];
        td1.innerHTML = fjh;
        tr.appendChild(td1);

        room.forEach(bed => {
            // todo:邪门？？？？？？
            // let template = `<button onclick="chooseBed(${bed.dormBuilding.id},${bed.fjh},${bed.ch},${bed.dormBuilding.ldm})">${bed.ch}</button> `
            // let template = `<button onclick="selectBed(${bed.fjh},${bed.dormBuilding.id})">${bed.ch}</button> `
            // let template = "<button onclick='chooseBed(" + bed.dormBuilding.id + "," + bed.fjh + "," + bed.ch + ")'>" + bed.ch + "</button> "
            // let template = "<button onclick='chooseBed(" + bed.ch + ")'>" + bed.ch + "</button> "
            // console.log(template)
            // td2.insertAdjacentHTML('beforeend', template);
            // td2.insertAdjacentHTML('beforeend', `<button>${bed.ch}</button> `);
            const {ldid, fjh, ch} = bed;
            const btn = document.createElement("button");
            btn.style.marginRight = "10px";
            btn.innerHTML = ch;
            btn.onclick = chooseBed.bind(this, ldid, fjh, ch)
            td2.appendChild(btn);

        })
        tr.appendChild(td2);
        roomBd.appendChild(tr);
    })

    async function chooseBed(ldid, fjh, ch) {
        // console.log(ldid, fjh, ch)
        finallyParm = {
            ldid, fjh, ch
        }
        grabBedDiv.style.display = "none";
        // window.alert("骚年稍安勿躁，到点开抢...")
        console.log('骚年稍安勿躁，到点开抢...');
        // const selectRes = await getJson(baseUrl + '/welcome/selectroom/selectbed',{
        //     ldid, fjh, ch
        // });
        // console.log(selectRes);
        let interval = setInterval(function () {
            const s = countdown(getTargetDay());
            // console.log(s === "00天 00:00:00")
            console.log(s);
            // console.log(s.slice(4).split(":")[0])
            console.log(s === "00天 00:00:00")
            if (s === "00天 00:00:00" || s.slice(4).length > 8) {
                GM_setValue('start', 1);
                interval && clearInterval(interval);
            }
        }, 100);
    }
})


// 获取倒计时
function countdown(time) {
    let nowTime = Date.now();
    let tarTime = +new Date(time);
    let countDownTime = (tarTime - nowTime) / 1000;
    let d, h, m, s;
    d = parseInt(countDownTime / 60 / 60 / 24);
    d = d < 10 ? '0' + d : d;
    h = parseInt(countDownTime / 60 / 60 % 24);
    h = h < 10 ? '0' + h : h;
    m = parseInt(countDownTime / 60 % 60);
    m = m < 10 ? '0' + m : m;
    s = parseInt(countDownTime % 60);
    s = s < 10 ? '0' + s : s;
    return `${d}天 ${h}:${m}:${s}`;
}

function getTargetDay(day, hour, min, second) {
    let date = new Date();
    day ? date.setDate(day) : date.setDate(2);
    hour ? date.setHours(hour) : date.setHours(8);
    min ? date.setMinutes(min) : date.setMinutes(59);
    second ? date.setMinutes(second) : date.setSeconds(56);
    return date;
}


// console.log(getTargetDay())
// const d1 = new Date()
// const d2 = getTargetDay(d1.getDay(), d1.getHours(), d1.getMinutes(), d1.getSeconds())
// console.log(+d1, +d2, +d1 === +d2)

// let ldid,fjh,ch;
let finallyParm = {}
// 是否到抢宿舍时间
GM_setValue('start', 0);


GM_addValueChangeListener('start', function (name, old_value, new_value, remote) {
    console.log("111")
    console.log(new_value);
    if (new_value == "1") {
        const handler = async function () {
            const startTime = new Date();
            // console.time("send request start")
            const selectRes = await getJson(baseUrl + '/welcome/selectroom/selectbed', finallyParm);
            // console.timeEnd("send request end")
            const endTime = new Date();
            console.log("finnally request time:", endTime - startTime);
            console.log("finally result => %o", selectRes.resultObject);
            console.log(this);
            if (selectRes.resultObject.indexOf("成功") > -1) {
                timmer && clearInterval(this);
            }
        }
        const timmer = setInterval(handler, 1000);
    }
})



