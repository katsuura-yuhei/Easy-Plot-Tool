'use strict';

$(document).ready(function(){
  $('.heading_option').on('click',function(){
    menuHidden();
    $('.option >div').toggleClass('hidden');
    edit_mode ="edit_point";
  });
  $('.heading_list').on('click',function(){
    menuHidden();
    $('.list >div').toggleClass('hidden');
    edit_mode ="edit_line";
  });
  $('.heading_area').on('click',function(){
    menuHidden();
    $('.area_select >div').toggleClass('hidden');
    edit_mode ="cal_area";
  });
  $('.heading_csv').on('click',function(){
    menuHidden();
    $('.read_csv >div').toggleClass('hidden');
    edit_mode ="new_point";
  });
  $('.heading_new_point').on('click',function(){
    menuHidden();
    $('.create_new_point >div').toggleClass('hidden');
    edit_mode ="new_point";
  });


  function menuHidden(){
    $('.list >div').addClass('hidden');
    $('.option >div').addClass('hidden');
    $('.area_select >div').addClass('hidden');
    $('.read_csv >div').addClass('hidden');
    $('.create_new_point >div').addClass('hidden');
  }



});

function traverseMenuChange(angle_notation){
  $('.radian >div').addClass('hidden');
  $('.radian_pi >div').addClass('hidden');
  $('.dosuhou_fun >div').addClass('hidden');
  $('.dosuhou_10shin >div').addClass('hidden');

  if(angle_notation=="radian"){
    $('.radian >div').toggleClass('hidden');
  }
  if(angle_notation=="radian_pi"){
    $('.radian_pi >div').toggleClass('hidden');
  }
  if(angle_notation=="dosuhou_fun"){
    $('.dosuhou_fun >div').toggleClass('hidden');
  }
  if(angle_notation=="dosuhou_10shin"){
    $('.dosuhou_10shin >div').toggleClass('hidden');
  }
}


//ここを再度記入するときにも適用する。ここにも関数を記載するか。
function unvisibleAngle(){
  //gのクラスを用いてそこを非表示にする関するを設定。
dispinfo[0]=0
svg.select(".angles").attr("display","none")
}
function visibleAngle(){
  //gのクラスを用いてそこを非表示にする関するを設定。
  dispinfo[0]=1
svg.select(".angles").attr("display","inline")
}
function unvisibleName(){
  //gのクラスを用いてそこを非表示にする関するを設定。
  dispinfo[2]=0
svg.select(".points").select(".texts").attr("display","none")
}
function visibleName(){
    dispinfo[2]=1
  //gのクラスを用いてそこを非表示にする関するを設定。
svg.select(".points").select(".texts").attr("display","inline")
}
function visibleDistance(){
    dispinfo[1]=1
  //gのクラスを用いてそこを非表示にする関するを設定。
svg.select(".lines").select(".texts").attr("display","inline")
}
function unvisibleDistance(){
      dispinfo[1]=0
  //gのクラスを用いてそこを非表示にする関するを設定。
svg.select(".lines").select(".texts").attr("display","none")
}

function unvisibleGrid(){
        dispinfo[3]=0
  //gのクラスを用いてそこを非表示にする関するを設定。
svg.selectAll(".grid").attr("display","none")
}
function visibleGrid(){
          dispinfo[3]=1
  //gのクラスを用いてそこを非表示にする関するを設定。
svg.selectAll(".grid").attr("display","inline")
}

//ボタンを押された時の処理を書く
function deleteButtonPush(point_num){
  //色を変える
  $(".point_"+String(point_num)).css('background-color','#888888');
  delete_point_list.push(point_num);
}

function changeButtonPush(point_num){
  //ここをテキストboxに変更できるか？
  change_point_list.push(point_num);
  let i =0;
  for (let j=0;j<points_data.length;j++){
    if (points_data[j].num ==point_num){
      i = j
    }

  }
  $(".point_"+String(point_num)).html("<tr><td><input type =\"text\"class=\"textform\" id =\"new_name"+points_data[i].num+"\"  value =\""+points_data[i].name+
  "\"</td><td><input type =\"text\"class=\"textform\" id =\"new_x"+points_data[i].num+"\"  value =\""+points_data[i].x_co+
  "\"</td><td><input type =\"text\"class=\"textform\" id =\"new_y"+points_data[i].num+"\"  value =\""+points_data[i].y_co+
  "\"</td><td><button type=\"button\" id=\""+points_data[i].num+"change\">変 更</button>"
  +"<button type=\"button\" id=\""+points_data[i].num+"_delete\">削 除</td></tr>")
}
//点名をプルダウンリストにできるようにするやり方。
function makePullDown(){
let pull_down_inner_text =makePullDownInner(points_data)
$("select").not('#paperselect').html(pull_down_inner_text)
}

function makePullDownInner(points_data){
  let text =""
  for(let i=0;i<points_data.length;i++){
    let option="<option value=\""+points_data[i].num+"\">"+points_data[i].name+"</option>"
    text=text+option
  }
  console.log(text)
  return text;
}

function makeList(points_data){
  document.getElementById('points_list').insertAdjacentHTML('beforeend',"<tr><th>点名</th><th>x座標</th><th>y座標</th><th>変更・削除</th></tr>")
  for(let i=0;i<points_data.length;i++){
    let li = "<tbody class =\"point_"+points_data[i].num+"\"><tr><td>"+points_data[i].name+"</td><td>"+points_data[i].x_co+"</td><td>"+points_data[i].y_co
    +"</td><td><button type=\"button\" id=\""+points_data[i].num+"_change\"onclick = changeButtonPush("+points_data[i].num+")>変 更</button>"
    +"<button type=\"button\" id=\""+points_data[i].num+"_delete\" onclick = deleteButtonPush("+points_data[i].num+")>削 除</td></tr></tbody>"
    document.getElementById('points_list').insertAdjacentHTML('beforeend',li)
  }
  let add_li = "<tr><td><input type =\"text\"class=\"textform\" id =\"new_name\"  value =\"\"></td><td><input type =\"text\"class=\"textform\" id =\"new_x\"  value =\"\"></td><td><input type =\"text\"class=\"textform\" id =\"new_y\" value =\"\"></td><td><button type=\"button\" value=\"add\">追 加</button></td></tr>"
  document.getElementById('points_list').insertAdjacentHTML('beforeend',add_li)
}
/*
  for(let i=0;i<points_data.length;i++){

    document.getElementById(points_data[i].num+"_delete").onclick =function(){
      deleteButtonPush(points_data[i].num)
      console.log(points_data[i])
    }

    document.getElementById(points_data[i].num+"_change").onclick =function(){

      console.log(i)

      changeButtonPush(points_data[i].num)
      console.log(points_data[i])
    }
  }
*/
  document.getElementById('list_form').onsubmit = function(event){
    event.preventDefault();
    //ポイントを変更する処理、未完成
    for(let i=0;i<points_data.length;i++){
      for(let j =0;j<change_point_list.length;j++){
        if(change_point_list[j]==points_data[i].num){
          console.log(points_data[i].num)
          let tmp_name = document.getElementById("new_name"+points_data[i].num).value
          let tmp_x = Number(document.getElementById("new_x"+points_data[i].num).value)
          let tmp_y = Number(document.getElementById("new_y"+points_data[i].num).value)
          points_data[i] = {name:tmp_name,x_co:tmp_x,y_co:tmp_y,num:points_data[i].num}
        }
      }
    }
    $('select').not('#paperselect').empty()
    makePullDown()


    change_point_list=[];

    //ポイントを追加する処理
    if((Number(document.getElementById("new_x").value)||document.getElementById("new_x").value==="0")&&(document.getElementById("new_y").value||document.getElementById("new_y").value==="0")){
      createNewPoint(document.getElementById("new_x").value,document.getElementById("new_y").value,document.getElementById("new_name").value)
    }
    //ポイントを消す処理
    deletePoints(delete_point_list);


    delete_point_list = [];

  }

//ポイントのナンバーからポイントの情報を呼び出す関数
function translateNumberToPoint(number){
  let p_num =Number(number);
  let tmp=0
  for(let i =0;i<points_data.length;i++){
    if(points_data[i].num ==p_num){
      tmp=i
    }
  }
  return points_data[tmp]
}
document.getElementById('create_midpoint').onsubmit = function(event){
  event.preventDefault();
  //ポイントを変更する処理、未完成
  let p1 = translateNumberToPoint(document.getElementById('create_midpoint').m_p1.value)
  let p2 = translateNumberToPoint(document.getElementById('create_midpoint').m_p2.value)

  let midpoint=calMidpoint(p1,p2)

  //点の位置が決まったので新点を作成する。

  //名前を決める
  let tmp_name="中点"+p1.name+p2.name
  createNewPoint(midpoint.x_co,midpoint.y_co,tmp_name)
}

  document.getElementById('create_cross_point').onsubmit = function(event){
    event.preventDefault();
    //ポイントを変更する処理、未完成
    let p1 = translateNumberToPoint(document.getElementById('create_cross_point').c_p1.value)
    let p2 = translateNumberToPoint(document.getElementById('create_cross_point').c_p2.value)
    let p3 = translateNumberToPoint(document.getElementById('create_cross_point').c_p3.value)
    let p4 = translateNumberToPoint(document.getElementById('create_cross_point').c_p4.value)
    let line1 = linkConbersionFunction([p1,p2])
    let line2 = linkConbersionFunction([p3,p4])
    let cross_point=calCrossPoint(line1,line2)
    console.log(cross_point)
    //点の位置が決まったので新点を作成する。

    //名前を決める
    let tmp_name="交点"+p1.name+p2.name+p3.name+p4.name
    createNewPoint(cross_point.x_co,cross_point.y_co,tmp_name)
  }

  document.getElementById('create_traverse_point').onsubmit = function(event){
    event.preventDefault();
    let p1 = translateNumberToPoint(document.getElementById('create_traverse_point').t_p1.value)
    let p2 = translateNumberToPoint(document.getElementById('create_traverse_point').t_p2.value)
    //let p3 = translateNumberToPoint(document.getElementById('create_traverse_point').t_p3.value)
    let d1 = Number(document.getElementById('create_traverse_point').t_distance.value)
    let t1 = 0
      if(angle_notation== "dosuhou_fun"){
    let t_angle_do = Number(document.getElementById('create_traverse_point').t_angle_do.value)
    let t_angle_fun = Number(document.getElementById('create_traverse_point').t_angle_fun.value)
    let t_angle_byou = Number(document.getElementById('create_traverse_point').t_angle_byou.value)
    t1 = translateFunByou(t_angle_do,t_angle_fun,t_angle_byou)
    console.log(t_angle_do)
    console.log(t1)

    }else{

    t1 = Number(document.getElementById('create_traverse_point').t_angle.value)

    //角度を弧度法に変換する。
    t1 = translateAngle2(t1,angle_notation)
  }
    //let tmp_angle = calAngle(p2,p3)
    let tmp_angle =calAngle(p1,p2)
    let traverse_point= calNewPointPolar(p1,tmp_angle+t1,d1)
    console.log(traverse_point)
    //点の位置が決まったので新点を作成する。

    //名前を決める、ここが未完成
    let tmp_name=nameAdjust(p1.name)
    createNewPoint(traverse_point.x_co,traverse_point.y_co,tmp_name)
  }

  document.getElementById('list_form').reset = function(event){
    event.preventDefault();
    listFormReset();

  }

  document.getElementById('url_output').onsubmit =function(event){
    event.preventDefault();
    //テキストboxを作成する。コピーボタンを作成し押すとクリップボードにコピーする。
    let url_in_box = makeQuery()
    console.log(url_in_box)
    document.getElementById("textbox_chushaku").textContent ="※下のテキストボックスの内容をコピーできます。"
    //let box_url =
    $('.textbox ').empty();
    document.getElementById('urlmake_textbox').insertAdjacentHTML("beforeEnd","<br><textarea rows =5 cols =60 >"+url_in_box+"</textarea>")
  }

//印刷モードにした際の処理　横幅、縦幅の固定、表の消去
  document.getElementById('printing_mode').onsubmit =function(event){
    event.preventDefault();

    printing_mode[0]=true
    newFigure()
$('.menu_outer >div').toggleClass('hidden');
$('.printing_menu>div').toggleClass('hidden');
  }
  //印刷モードで紙の大きさを変えた時の処理
  function printingChange(){
    let papersize = document.getElementById("paperselect").value
    switch(papersize){
    case "A3縦": printing_mode[1].width =950
    printing_mode[1].height =1300; break;
    case "A3横": printing_mode[1].width =1500
    printing_mode[1].height =900; break;
    case "A4縦": printing_mode[1].width =650
    printing_mode[1].height =900; break;
    case "A4横": printing_mode[1].width =950
    printing_mode[1].height =550; break;
  }
  newFigure()
}


function printingOff(){
  printing_mode[0]=false
  newFigure()
  $('.menu_outer >div').toggleClass('hidden');
  $('.printing_menu>div').toggleClass('hidden');
  }

function printingOn(){

  //ここに印刷に向けた処理、題名の入力ボックスをテキスト化、ボタンを消す。
  window.print();
}

function listFormReset(){
  console.log("reset")
  delete_point_list = [];

  //バックグラウンドの色をすべて戻す処理→リストを一から作り直す
  $('table').empty()
  makeList(points_data)

}

function changeClickImput(){
  consle.log("click_input_mode")
  click_input_mode = true
}

function cancelClickImput(){
  consle.log("click_input_cancel")
  click_input_mode = false
}

document.getElementById('form').onsubmit　= function(event){
  event.preventDefault();
//ラジオボタンがie未対応のため要改良
let elements = document.getElementsByName( "sokuryo_math" )
for ( var a="", i=elements.length; i--; ) {
  if ( elements[i].checked ) {
    var a = elements[i].value ;
    break ;
  }
}

 elements = document.getElementsByName( "angle_notation" )
for ( var b="", i=elements.length; i--; ) {
  if ( elements[i].checked ) {
    var b = elements[i].value ;
    break ;
  }
}
 elements = document.getElementsByName( "digit" )
for ( var c="", i=elements.length; i--; ) {
  if ( elements[i].checked ) {
    var c = elements[i].value ;
    break ;
  }
}
sokuryo_math = a

angle_notation = b
digit = Number(c)
traverseMenuChange(angle_notation)
//sokuryo_math = document.getElementById('form').sokuryo_math.value
//angle_notation = document.getElementById('form').angle_notation.value
//digit = Number(document.getElementById("form").digit.value)


$('svg').empty()

drawFigure()

if(document.getElementById('form').angle_indication.checked){
  visibleAngle()
  dispinfo[0]=1
}else{
  unvisibleAngle()
    dispinfo[0]=0
}

if(document.getElementById('form').grid_indication.checked){
  visibleGrid()
    dispinfo[3]=1
}else{
  unvisibleGrid()
    dispinfo[3]=0
}
if(document.getElementById('form').distance_indication.checked){
  visibleDistance()
    dispinfo[1]=1
}else{
  unvisibleDistance()
    dispinfo[1]=0
}

if(document.getElementById('form').name_indication.checked){
  visibleName()
    dispinfo[2]=1
}else{
  unvisibleName()
    dispinfo[2]=0
}
if(document.getElementById('form').hover_indication.checked){
  hover_mode =true
  dispinfo[4]=1
}else{
  hover_mode =false
  dispinfo[4]=0
}

}

//入力した点を追加するための処理
document.getElementById('make_circle').onsubmit = function(event){
  event.preventDefault();
  let name1 = document.getElementById('direct_input').name1.value
  let x1 = document.getElementById('direct_input').x1.value
  let y1 = document.getElementById('direct_input').y1.value

  if((Number(x1)||x1==="0")&&(Number(y1)||y1==="0")){
    createNewPoint(x1,y1,name1)
  }

}

//ファイルアップローダー用の内容を書く←アップロードではなくて読み込みだけでよい？
document.getElementById('read_csv').onsubmit= function(event){
  event.preventDefault();
  console.log( document.getElementById('example1').value)

  let file = document.querySelector('#example1');
  let fileList = file.files;

  let reader = new FileReader();
  //console.log(fileList)
  reader.readAsText(fileList[0]);
  console.log(reader.readyState)
  reader.onload=function(){
    console.log(reader.result)
    //readerのテキストを関数にするための処理をする。正規表現？
    var datatext = reader.result
    //改行で分割する
    console.log(datatext.split(/\n/gim))
    var point_texts =datatext.split(/\n/gim)

    let one_point_line =[]
    //ここでポイントとリンクのデータを初期化→注意
    //ここでieが反応しない forloopしないといけない
    //console.log(document.getElementById('read_csv').new_add.value)
    let elements = document.getElementsByName( "new_add" )
    for ( var a="", i=elements.length; i--; ) {
      if ( elements[i].checked ) {
        var a = elements[i].value ;
        break ;
      }
    }

    //if(document.getElementById('read_csv').new_add.value =="new_point"){
    if(a =="new_point"){
      points_data =[]
      links =[]
    }
    let k = points_data.length
    //ここでポイントの最大の値からとできる。
    if(k>0){
      k = Number(points_data[k-1].num)
    }
    //改行の分だけループする 0行は見出しなので別枠の関数もしくは使用しない、課題→追加の際のnumの扱いをどうにかする。
    for (var i =1; i <point_texts.length;i++){
      one_point_line = point_texts[i].split(/,/gi)
      console.log(one_point_line)
      if(one_point_line.length>=3){
        points_data.push({name:one_point_line[0],x_co:parseFloat(one_point_line[1]),y_co:parseFloat(one_point_line[2]),num:i+k})
      }
    }

    //前に書いていたSVGを消す処理
    $('svg').empty()
    //ここで書いたポイントを加える処理
    drawFigure()
    //リストを作る処理
    $('table').empty()
    makeList(points_data)
    //プルダウンのタグを更新する処理
    $('select').not('#paperselect').empty()
    makePullDown()
  }

}
document.getElementById('qr_output').onsubmit= function(event){
  event.preventDefault();
  makeQR()
}

//ファイルを出力するための個所
document.getElementById('output').onsubmit= function(event){
  event.preventDefault();
  console.log("syuturyoku");
  let contents ="name,x_co,y_co\n";
  for(let i=0;i<points_data.length;i++){
    contents += points_data[i].name+","+points_data[i].x_co+","+points_data[i].y_co+"\n"
  }
  const blob = new Blob([contents], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  //ファイル名の設定　今日の日付＋listとかかな
  let now =new Date();
  console.log(now)
  let year =String(now.getFullYear());
  let month =String(now.getMonth()+1);
  if (now.getMonth()<9){
    month ="0"+month
  }
  let date =String(now.getDate());
  if (now.getDate()<10){
    date ="0"+date
  }
  a.download = year+month+date+'list.csv';
  a.href = url;
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

}

function makeQuery(){

    let contents ="https://easy-plot.com/?";
    //バージョン管理
    let version ="1"
    contents +="ver="+version+"&"
    //設定の管理
    let option_num =""
    if(sokuryo_math=="math"){
      option_num +=String(1)
    }else{option_num +=String(2)}
    switch(angle_notation){
      case "dosuhou_fun" : option_num += String(1); break;
      case "dosuhou_10shin" : option_num +=String(2); break;
      case "radian" : option_num +=String(3); break;
      case "radian_pi" : option_num +=String(4); break;
    }
    option_num +=String(digit)
    for(let i=0;i<dispinfo.length;i++){
      option_num +=String(dispinfo[i])

    }
    contents +="opt="+option_num+"&pnt="
    for(let i=0;i<points_data.length;i++){
      contents += points_data[i].name+","+points_data[i].x_co+","+points_data[i].y_co+","
    }
    //線をつける関数を作る(未)
    let ln =[]
    //numと列の順番を整合させる関数を作る
    function numToOrder(nm){
      let order =0
      for(let i=0;i<points_data.length;i++){
        if(nm==points_data[i].num){
          order = i
        }
      }
      return order
    }
    //linksから点を取ってくる。
    for(let i=0;i<links.length;i++){
      ln.push(numToOrder(links[i][0].num))
      ln.push(numToOrder(links[i][1].num))
    }
    console.log(ln)
    //ここで線用のクエリパラメータを作成
    contents += "&ln="
    for(let i=0;i<ln.length;i++){
       contents+=String(ln[i])+","

    }
    return contents
}

//クエリパラメータを出力する関数
function makeQR(){
  let contents = makeQuery()
  console.log(contents)
  let encodeURL = encodeURIComponent(contents)
  console.log(encodeURL)

  open("https://api.qrserver.com/v1/create-qr-code/?data="+encodeURL)
}
//ファイルをクエリパラメータで出力する。
/*
document.getElementById('query-output').onsubmit= function(event){
  event.preventDefault();
  makeQuery()

}
*/





makeList(points_data)

makePullDown()
console.log(points_data)
