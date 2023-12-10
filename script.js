//rule:ルール M:今のM N:今のN ID:プレイヤーID(ニューゲームでも次の番号から) data:前までの状態を保存
let rule = "ox";
let M = 1;
let N = 1;
let ID = 0;
let data = [];

//設定の開閉
document.getElementById("form-open").addEventListener("click",()=>{
    let f = document.getElementById("setting");
    let o = document.getElementById("form-open");
    if(f.style.display == "none"){
        f.style.display = "block";
        o.value = "-";
    }else{
        f.style.display = "none";
        o.value = "+";
    }
});

//ルール選択したらそれに応じたN,Mの値入力を表示
document.getElementById("rule-select").addEventListener("change",()=>{
    let ruleset = document.getElementById("rule-select");
    let inpM = document.getElementById("m");
    let inpN = document.getElementById("n");
    inpM.value = 5;
    inpN.value = 3;
    if(ruleset.value == "fr"){
        inpM.style.visibility = "hidden"
        inpN.style.visibility = "hidden"
    }else if(ruleset.value == "ox"){
        inpM.style.visibility = "visible"
        inpN.style.visibility = "visible"
        inpM.value = "";
        inpN.value = "";
    }else if(ruleset.value == "by"){
        inpM.style.visibility = "visible"
        inpN.style.visibility = "hidden"
        inpM.value = "";
    }else if(ruleset.value == "ny"){
        inpM.style.visibility = "visible"
        inpN.style.visibility = "hidden"
        inpM.value = "";
    }else if(ruleset.value == "ud"){
        inpM.style.visibility = "visible"
        inpN.style.visibility = "hidden"
        inpM.value = "";
    }
    rule = ruleset.value;
});

//新しいゲームを開始
document.getElementById("start").addEventListener("click",newGame);
function newGame(){
    //履歴の初期化など
    data = [];
    let table = document.getElementById("table");
    let player = document.getElementById("player").value;
    if(player < 1 || player % 1 != 0){
        alert("無効な値が入力されています");
        return;
    }
    M = Number(document.getElementById("m").value);
    N = Number(document.getElementById("n").value);
    if(M < 1 || M % 1 != 0){
         alert("無効な値が入力されています");
         return;
    }
    if(N < 1 || N % 1 != 0){
         alert("無効な値が入力されています");
         return;
    }
    //ルールに応じて要素を配置
    let tmp = "ルール : ";
    if(rule == "fr") tmp += "Free";
    if(rule == "ox") tmp += M + "◯" + N + "✕";
    if(rule == "by") tmp += M + "by" + M;
    if(rule == "ny") tmp += M + "NewYork";
    if(rule == "ud") tmp += M + "Up Down";
    document.getElementById("rule").textContent = tmp;
    while(table.firstChild){
        table.removeChild(table.firstChild);
    }
    for(let i = 0;i < player;i++){
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        let ip = document.createElement("input");
        let p;
        let uid = ID;
        ip.type = "text";
        ip.value = "Player" + (i + 1);
        td.appendChild(ip);
        tr.appendChild(td);

        td = document.createElement("td");
        if(rule == "fr" || rule == "ox" || rule == "by"){ 
            p = document.createElement("span");
            p.textContent = " ◯:"
            td.appendChild(p);

            ip = document.createElement("input");
            ip.type = "text";
            ip.id = "tru" + uid;
            ip.className = "dataset";
            ip.value = 0;
            ip.disabled = true;
            td.appendChild(ip);
        }
        if(rule == "fr" || rule == "ox" || rule == "by"){
            p = document.createElement("span");
            p.textContent = " ✕:"
            td.appendChild(p);

            ip = document.createElement("input");
            ip.type = "text";
            ip.id = "fal" + uid;
            ip.className = "dataset";
            ip.value = 0;
            ip.disabled = true;
            td.appendChild(ip);
        }
        if(rule == "by" || rule == "ny" || rule == "ud"){
            p = document.createElement("span");
            p.textContent = " Score:"
            td.appendChild(p);

            ip = document.createElement("input");
            ip.type = "text";
            ip.className = "dataset";
            ip.id = "res" + uid;
            ip.value = 0;
            ip.disabled = true;
            td.appendChild(ip);
        }
        tr.appendChild(td);

        td = document.createElement("td");
        ip = document.createElement("input");
        ip.type = "button";
        ip.value = "◯";
        ip.addEventListener("click",()=>{pointAdd(uid)});
        td.appendChild(ip);
        tr.appendChild(td);

        td = document.createElement("td");
        ip = document.createElement("input");
        ip.type = "button";
        ip.addEventListener("click",()=>{pointsub(uid)});
        ip.value = "✕";
        td.appendChild(ip);
        tr.appendChild(td);

        td = document.createElement("td");
        ip = document.createElement("input");
        ip.type = "text";
        ip.className = "dataset";
        ip.id = "state" + uid;
        ip.disabled = true;
        ip.value = "-";
        td.appendChild(ip);
        tr.appendChild(td);

        table.appendChild(tr);
        ID++;
    }
    //最初の履歴を追加
    let values = [];
    let datasets = document.getElementsByClassName("dataset");
    for(let i = 0;i < datasets.length;i++){
        values.push(datasets[i].value);
    }
    data[data.length] = values;
}

//正解
function pointAdd(x){
    if(rule == "fr" || rule == "ox" || rule == "by"){
        let txt = document.getElementById("tru" + x);
        txt.value = Number(txt.value) + 1;
    }
    pointRes(x,1);
}

//不正解
function pointsub(x){
    if(rule == "fr" || rule == "ox" || rule == "by"){
        let txt = document.getElementById("fal" + x);
        txt.value = Number(txt.value) + 1;
    }
    pointRes(x,-1);
}

//点数、勝敗判定 引数x=id,正答ならy=1,誤答ならy=-1
function pointRes(x,y){
    let datasets = document.getElementsByClassName("dataset");
    let time = new Date();
    let cont = true;
    let win = false;
    let truTxt = document.getElementById("tru" + x);
    let falTxt = document.getElementById("fal" + x);
    let resTxt = document.getElementById("res" + x);
    let stateTxt = document.getElementById("state" + x);
    if(rule == "by"){
        resTxt.value = Number(truTxt.value) * (M - Number(falTxt.value));
        if(resTxt.value >= M * M) win = true;
        if(falTxt.value >= M) cont = false;
    }
    if(rule == "ny"){
        if(y == 1){
            resTxt.value = Number(resTxt.value) + 1;
        }else if(y == -1){
            resTxt.value = Number(resTxt.value) - 1;
        }
        if(resTxt.value >= M) win = true;
    }
    if(rule == "ud"){
        if(y == 1){
            resTxt.value = Number(resTxt.value) + 1;
            if(resTxt.value >= M) win = true;
        }else if(y == -1){
            resTxt.value = 0;
            if(stateTxt.value == "-"){
                stateTxt.value = "誤答1";
            }else{
                cont = false;
            }
        }
    }
    if(rule == "ox"){
        if(truTxt.value >= M) win = true;
        if(falTxt.value >= N) cont = false;
    }
    if(!cont){
        stateTxt.value = "失格  " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    }
    if(win){
        stateTxt.value = "Win!  " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    }
    let values = [];
    for(let i = 0;i < datasets.length;i++){
        values.push(datasets[i].value);
    }
    data[data.length] = values;
}

//1手前の状態に戻す
document.getElementById("undo").addEventListener("click",()=>{
    if(data.length > 1){
        let datasets = document.getElementsByClassName("dataset");
        for(let i = 0;i < datasets.length;i++){
            datasets[i].value = data[data.length - 2][i];
        }
        data.pop();
    }
});
