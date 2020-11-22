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

function unvisibleAngle(){
  //gのクラスを用いてそこを非表示にする関するを設定。
svg.select(".angles").attr("display","none")
}
function visibleAngle(){
  //gのクラスを用いてそこを非表示にする関するを設定。
svg.select(".angles").attr("display","inline")
}
function unvisibleName(){
  //gのクラスを用いてそこを非表示にする関するを設定。
svg.select(".points").select(".texts").attr("display","none")
}
function visibleName(){
  //gのクラスを用いてそこを非表示にする関するを設定。
svg.select(".points").select(".texts").attr("display","inline")
}
function visibleDistance(){
  //gのクラスを用いてそこを非表示にする関するを設定。
svg.select(".lines").select(".texts").attr("display","inline")
}
function unvisibleDistance(){
  //gのクラスを用いてそこを非表示にする関するを設定。
svg.select(".lines").select(".texts").attr("display","none")
}

function unvisibleGrid(){
  //gのクラスを用いてそこを非表示にする関するを設定。
svg.selectAll(".grid").attr("display","none")
}
function visibleGrid(){
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
$("select").html(pull_down_inner_text)
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
    $('select').empty()
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
    let p3 = translateNumberToPoint(document.getElementById('create_traverse_point').t_p3.value)
    let t1 = Number(document.getElementById('create_traverse_point').t_angle.value)
    let d1 = Number(document.getElementById('create_traverse_point').t_distance.value)
    let tmp_angle = calAngle(p2,p3)
    let traverse_point= calNewPointPolar(p1,tmp_angle+t1,d1)
    console.log(traverse_point)
    //点の位置が決まったので新点を作成する。

    //名前を決める、ここが未完成
    let tmp_name="新点"+p1.name+"-1"
    createNewPoint(traverse_point.x_co,traverse_point.y_co,tmp_name)
  }

  document.getElementById('list_form').reset = function(event){
    event.preventDefault();
    listFormReset();

  }

}

function listFormReset(){
  console.log("reset")
  delete_point_list = [];

  //バックグラウンドの色をすべて戻す処理→リストを一から作り直す
  $('table').empty()
  makeList(points_data)

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

//sokuryo_math = document.getElementById('form').sokuryo_math.value
//angle_notation = document.getElementById('form').angle_notation.value
//digit = Number(document.getElementById("form").digit.value)


$('svg').empty()

drawFigure()

if(document.getElementById('form').angle_indication.checked){
  visibleAngle()
}else{
  unvisibleAngle()
}

if(document.getElementById('form').grid_indication.checked){
  visibleGrid()
}else{
  unvisibleGrid()
}
if(document.getElementById('form').distance_indication.checked){
  visibleDistance()
}else{
  unvisibleDistance()
}

if(document.getElementById('form').name_indication.checked){
  visibleName()
}else{
  unvisibleName()
}
if(document.getElementById('form').hover_indication.checked){
  hover_mode =true
}else{
  hover_mode =false
}

}

//入力した点を追加するための処理
document.getElementById('direct_input').onsubmit = function(event){
  event.preventDefault();
  let name1 = document.getElementById('direct_input').name1.value
  let x1 = document.getElementById('direct_input').x1.value
  let y1 = document.getElementById('direct_input').y1.value
  /*
  let name2 = document.getElementById('direct_input').name2.value
  let x2 = document.getElementById('direct_input').x2.value
  let y2 = document.getElementById('direct_input').y2.value
  let name3 = document.getElementById('direct_input').name3.value
  let x3 = document.getElementById('direct_input').x3.value
  let y3 = document.getElementById('direct_input').y3.value
  */
  if((Number(x1)||x1==="0")&&(Number(y1)||y1==="0")){
    createNewPoint(x1,y1,name1)
  }
  /*
  if((Number(x2)||x2==="0")&&(Number(y2)||y2==="0")){
    createNewPoint(x2,y2,name2)
  }if((Number(x3)||x3==="0")&&(Number(y3)||y3==="0")){
    createNewPoint(x3,y3,name3)
  }
  */
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
  }

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






makeList(points_data)

makePullDown()
console.log(points_data)
