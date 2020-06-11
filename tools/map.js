const Tools = require("./tools");
const MAP = [];
var map = {
    TYPE_NUM: 1,//1 R1<->R3 R1^R2^R3 - RANDOM
    get: function (key) {
        let key1 = key.substring(0, 1);
        let key2 = key.substring(1, 2);
        key = key.substring(2);
        this.initMap(key);
        this.Reduction(key1, key2);
        let res = Tools.hexToString(MAP.join(","));
        MAP.splice(0, MAP.length);
        return res;
    },
    set: function (key) {
        this.initMap(key);
        let t1 = Math.floor(Math.random() * 10);
        let t2 = Math.floor(Math.random() * 10);
        this.transform(t1, t2);//生成0-9的随机数;
        let res = t1 + "" + t2 + Tools.hexToString(MAP.join(","));
        MAP.splice(0, MAP.length);
        return res;
    },
    initMap: function (value) {
        let k = value.split("");
        for (let i = 0; i < k.length; i++) {
            const e = k[i];
            var c = Tools.stringToHex(e);
            c = c.split("");
            c.forEach(e => {
                MAP.push(e);
            });
        }
        if (MAP.length == 0)
            return;
        let r1 = [], r2 = [], r3 = [];
        for (let i = 0; i < 6; i++) {
            r1[i] = MAP[i];
            r2[i] = MAP[i + 6];
            r3[i] = MAP[i + 12];
        }
        MAP.splice(0, MAP.length);
        MAP.push(r1, r2, r3);
    },
    refresh: function () {

    },
    transform: function (type1, type2) {
        this.transformRow(type1);
        this.transformCol(type2);
        let newMap = [...MAP[0], ...MAP[1], ...MAP[2]];
        MAP.splice(0, MAP.length);
        for (let m = 0; m < newMap.length; m = m + 2) {
            MAP.push(newMap[m] + "" + newMap[m + 1]);
        }
    },
    //312 231
    transformRow: function (type) {
        type = type % 2 == 0 ? 2 : 1;
        let r1 = MAP[0], r2 = MAP[1], r3 = MAP[2];
        switch (type) {
            case 1:
                MAP.splice(0, MAP.length);
                MAP.push(r3, r1, r2)
                break;
            case 2:
                MAP.splice(0, MAP.length);
                MAP.push(r2, r3, r1)
                break;
            default:
                break;
        }
    },
    //312 231
    transformCol: function (type) {
        type = type % 2 == 0 ? 2 : 1;
        switch (type) {
            case 1:
                MAP.forEach(arr => {
                    let e = arr[0];
                    arr[0] = arr[2];
                    arr[2] = e;
                    e = arr[4];
                    arr[4] = arr[0];
                    arr[0] = e;
                });
                break;
            case 2:
                MAP.forEach(arr => {
                    let e = arr[0];
                    arr[0] = arr[2];
                    arr[2] = e;
                    e = arr[4];
                    arr[4] = arr[2];
                    arr[2] = e;
                });
                break;
            default:
                break;
        }
    },
    Calculations: function () {

    },
    Reduction: function (key1, key2) {
        key1 = parseInt(key1);
        key2 = parseInt(key2)
        if (!isNaN(key1) && !isNaN(key2)) {
            this.transformCol(key2+1);
            this.transformRow(key1+1);
            let newMap = [...MAP[0], ...MAP[1], ...MAP[2]];
            MAP.splice(0, MAP.length);
            for (let m = 0; m < newMap.length; m = m + 2) {
                MAP.push(newMap[m] + "" + newMap[m + 1]);
            }
        } else {
            MAP.splice(0, MAP.length);
        }
    },
}
module.exports = map;