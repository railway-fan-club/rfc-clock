{
    /** (未実装) 模型時刻[秒]単位で、端末時刻からどれくらいずらすか */
    const PARAM_NAME_DELAY = "delay";
    /** 表示するイベント種別 (`hanabi`等) */
    const PARAM_NAME_EVENT = "event";
    /** 下部に表示する案内メッセージ */
    const PARAM_NAME_INFOTEXT = "infotext";
    /** 模型時刻での1日の長さ[秒] */
    const PARAM_NAME_TIME_LEN = "time-len";
    /** 現実1秒で模型時刻がどれくらい進むか[現実秒] */
    const PARAM_NAME_TIME_MULTIPLIER = "time-multiplier";

    // modelTotalSecでの日付変更時刻[模型秒]
    // 例: 15 * 60 * 60 は模型時刻15:00:00
    const DEFAULT_TIME_LEN_S = 3 * 60 * 60;
    
    const DEFAULT_TIME_MULTIPLIER = 60;

    /**
     * Get the URL parameter value
     *
     * @param  name {string} パラメータのキー文字列
     * @param  url {url} 対象のURL文字列（任意）
     * @returns {string} パラメータの値
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
    /**
     * URLパラメータから値を取得するか、パラメータが指定されていなければローカルストレージから取得する
     * URLパラメータが指定されていた場合、それをローカルストレージに保存する
     * 
     * @param {string} name パラメータ名
     */
    function getParamWithLocalStorage(name) {
        const paramValue = getParam(name);
        if (paramValue) {
            localStorage[name] = paramValue
            return paramValue
        } else {
            return localStorage[name]
        }
    }

    //特殊モード（秩父夜祭花火用）
    var eventMode = getParamWithLocalStorage(PARAM_NAME_EVENT) || "";

    const timeLen_ModelS = Number(getParamWithLocalStorage(PARAM_NAME_TIME_LEN)) || DEFAULT_TIME_LEN_S;
    const timeMultiplier = Number(getParamWithLocalStorage(PARAM_NAME_TIME_MULTIPLIER)) || DEFAULT_TIME_MULTIPLIER;

    /**
     * 模型時刻での現在時刻を模型秒単位で取得する
     * @param {boolean} withMilliSec ミリ秒まで取得するかどうか
     * @returns {number} 模型時刻での現在時刻[模型秒]
     */
    function getModelTotalSec(withMilliSec = false) {
        const now = new Date();
        const realHour = timeMultiplier < 30 ? now.getHours() : 0;
        const realMinute = now.getMinutes();
        const realSecond = now.getSeconds();
        const realMilliSec = withMilliSec ? now.getMilliseconds() : 0;
        const realTotalSec = realHour * 3600 + realMinute * 60 + realSecond + realMilliSec / 1000;
        const modelTotalSec = (realTotalSec * timeMultiplier) % timeLen_ModelS;
        return modelTotalSec;
    }

    /**
     * 指定桁数までゼロ埋めした文字列を取得する
     * 
     * @param {number} num ゼロ埋めしたい数値
     * @param {number} length ゼロ埋め後の桁数
     * @returns {string} ゼロ埋めした文字列
     */
    function numPad(num, length = 2) {
        return ("0000000000" + num).slice(-length);
    }

    //打ち上げ開始時刻
    var hanabi_start = 18;
    // イベント管理用 模型時刻[時] を格納する変数
    var minute1 = 0;
    var isInfoTextSet = false;
    function clock() {
        if (!isInfoTextSet) {
            const infotext = getParamWithLocalStorage(PARAM_NAME_INFOTEXT) || "";
            document.getElementById('infotext').innerHTML = infotext;
            isInfoTextSet = true;
        }
        const now = new Date();
        const year = now.getFullYear();
        const month = numPad(now.getMonth() + 1);
        const date = numPad(now.getDate());
        const hour = numPad(now.getHours());
        const minute = numPad(now.getMinutes());
        const second = numPad(now.getSeconds());

        const modelTotalSec = getModelTotalSec(timeMultiplier != 60);
        const modelHourNum = Math.abs(Math.floor(modelTotalSec / 3600));
        const modelMinuteNum = Math.abs(Math.floor((modelTotalSec / 60) % 60));
        const modelHour = numPad(modelHourNum);
        const modelMinute = numPad(modelMinuteNum);
        minute1 = modelHourNum;

        document.getElementById('RFCClock').innerHTML = `${modelHour}:${modelMinute}`;
        document.getElementById('Calendar').innerHTML = `現在時刻 ${year}/${month}/${date} ${hour}:${minute}:${second}`;

        const now_ms = now.getMilliseconds();
        const timeUntilNextSec_ms = (1000 - now_ms) / (Math.max(timeMultiplier, 60) / 60);
        window.setTimeout("clock()", timeUntilNextSec_ms);
    }
    window.addEventListener('load', function () {
        clock();
        const settingDialog = document.getElementById("setting-dialog");
        const rfcLogoImg = document.getElementById("rfc_logo");
        rfcLogoImg.onclick = function () {
        	settingDialog.style.display = "fixed";
        }
        const dialogCancelBtn = document.getElementById("dialog-cancel");
        dialogCancelBtn.onclick = function () {
        	settingDialog.style.display = "none";
        }
    })
}