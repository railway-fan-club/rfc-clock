{
    /**
     * Get the URL parameter value
     *
     * @param  name {string} パラメータのキー文字列
     * @return  url {url} 対象のURL文字列（任意）
     */
    function getParam(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    var delay = 0;
    if (getParam("deley") !== null) {
        var delay = getParam("deley");
    }
    //特殊モード（秩父夜祭花火用）
    var event = null;
    if (getParam("event") !== null) {
        event = getParam("event");
    }

    //打ち上げ開始時刻
    var hanabi_start = 18;
    var minute1; //グローバル変数に昇格
    function clock() {
        var param = location.search;
        var infotext = '';
        if (getParam("infotext") !== null) {
            infotext = getParam("infotext");
        }

        document.getElementById('infotext').innerHTML = decodeURI(infotext);

        var delay_button;
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        minute1 = now.getMinutes();
        var minute2 = now.getMinutes();
        var second = now.getSeconds();
        minute1 = minute1 - delay;
        if (month < 10) {
            month = "0" + month;
        }
        if (date < 10) {
            date = "0" + date;
        }
        if (hour < 10) {
            hour = "0" + hour;
        }
        if (minute1 > 29) {
            minute1 = minute1 - 30;
        }
        if (minute1 < 0) {
            minute1 = minute1 + 30;
        }
        if (minute1 < 10) {
            minute1 = "0" + minute1;
        }
        if (minute2 < 10) {
            minute2 = "0" + minute2;
        }
        if (second < 10) {
            second = "0" + second;
        }
        document.getElementById('RFCClock').innerHTML = minute1 + ":" + second;
        document.getElementById('Calendar').innerHTML = "現在時刻" + "  " + year + "/" + month + "/" + date + " " + hour +
            ":" + minute2 + ":" + second;

        var now_ms = now.getMilliseconds();
        var timeUntilNextSec_ms = 1000 - now_ms;
        window.setTimeout("clock()", timeUntilNextSec_ms);
    }
    window.onload = clock;
    window.addEventListener('load', function () {
        delay_button = document.getElementById("RFCClock");
        // delay_button.onclick = function () {
        // 	if (delay <= 30) {
        // 		delay = delay + 5;
        // 	} else {
        // 		delay = delay - 25;
        // 	}
        // }
    })
}