'use strict'

//クエリパラメータを取得
let querypr = location.search
console.log(querypr)
let points_data =[{name:"a",x_co:-10,y_co:1,num:1},{name:"b",x_co:10,y_co:120,num:2},{name:"c",x_co:50,y_co:80,num:3},{name:"d",x_co:-60,y_co:65,num:4}];
//let points_data =[]
let points = []
let xmax = 1
let xmin = -1
let ymax = 1
let ymin = -1
let x_y=(xmax-xmin)/(ymax-ymin)
let length_standard = 900/x_y
if (length_standard>600){
  length_standard =600
}
let margin = {top: 1, right: 1, bottom: 1, left: 1}
let width = window.innerWidth -580
if(width<400){width= window.innerWidth*0.9}
let height = 700;
if(window.innerWidth<500){height =400}
let x = d3.scaleLinear()
.domain([0,width])
.range([0,width]);
let arcX =d3.scaleLinear()
.domain([0,width])
.range([0,width]);
let arcY =d3.scaleLinear()
.domain([0,height])
.range([height, 0]);

let y = d3.scaleLinear()
.domain([0,height])
.range([height, 0]);

let delete_mode = false

//設定で決めるもの
let sokuryo_math ="sokuryo"
let angle_notation ="dosuhou_fun"
let digit =3
let dispinfo =[1,1,1,1,1]
let printing_mode =[false,{width:950,height:550}]
let font_size =20
let font_size_num =15
let line_width = 1.5
let links =[]
let perpendicular_links=[]
let save_point =[false,{name:"",x_co:0,y_co:0}]
let save_link =[]
let valueline = d3.line()
.x(function(d) { return x(d.x_co); })
.y(function(d) { return y(d.y_co); });
//divの宣言をする。
let div = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);
// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin

let svg = d3.select("svg")
    //  .attr("viewBox", [0, 0, width, height]);
    .attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
let link =  svg.selectAll("line")
.data(links)
.enter()
.append("line")
.attr("class", "links_line")
.style("stroke", "black")

let edit_mode = "edit_point"
//上のedit_modeと共有した方がよい？？
let click_input_mode = false
function clickInputMode(){
  click_input_mode = true

}
function clickInputModeKaijo(){
  click_input_mode = false
}


let x_move = 0
let y_move = 0
let bairitsu = 1

let delete_point_list =[]
let change_point_list =[]
let hover_mode = true
let floor_or_round ="floor"

let area_link=[]

let points_size=5
if(window.innerWidth<500){points_size=7}
/*
let xAxis =svg.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x));

let yAxis =svg.append("g")
.call(d3.axisLeft(y));
*/
let xAxis = d3.axisBottom(x)
.ticks(width / height * 10)
.tickSize(height)
.tickPadding(8 - height);

let yAxis = d3.axisRight(y)
.ticks(10)
.tickSize(width)
.tickPadding(8 - width);


let gX = svg.append("g").call(xAxis);
let gY = svg.append("g").call(yAxis);


//zoom機能を実装できるか？

var zoom = d3.zoom()
//.scaleExtent([0.5, 1000])
//.translateExtent([
//  [-100, -100],
//  [width + 90, height + 100]
//])

.on("zoom", zoomed);

//取得したクエリパラメータを点に変換して表示する関数。
function queryprCut(querypr){
  //querypr = decodeURIComponent(querypr)
  console.log(querypr)
  if(querypr ==""){
      return{ver:"",opt:"",pnt:"",ln:""}
  }
  console.log(typeof querypr)
  let version = querypr.match(/[?]ver=\w*&/u)[0]
  version  = version.match(/\d+/u)[0]
  let option = querypr.match(/opt=\w*&/u)[0]
  option  = option.match(/\d+/u)[0]
  let points = querypr.match(/pnt=([\w_.,%-])*/u)[0]
  points =  points.slice(4)
  let lines =querypr.match(/ln=([\w_.,%-])*/u)[0]
  lines = lines.slice(3)
  console.log([version,option,points,lines])
  return{ver:version,opt:option,pnt:points,ln:lines}
}

function firstOption(opt){
  //全七桁であり一桁目から7桁目まで情報を持っている。
  if(opt ==""){
    return
  }
  if(opt.charAt(0)==1){
    sokuryo_math="math"
  }else{sokuryo_math="sokuryo"}
  switch(opt.charAt(1)){
    case 1:angle_notation = "dosuhou_fun" ; break;
    case 2:angle_notation = "dosuhou_10shin" ; break;
    case 3:angle_notation = "radian" ; break;
    case 4:angle_notation = "radian_pi" ; break;
  }
  digit = Number(opt.charAt(2))
  if(opt.charAt(3)==0){
    dispinfo[0]=0;

  }
  if(opt.charAt(4)==0){
    dispinfo[1]=0;

  }
  if(opt.charAt(5)==0){
    dispinfo[2]=0;

  }
  if(opt.charAt(6)==0){
    dispinfo[3]=0;

  }
  if(opt.charAt(7)==0){
    dispinfo[4]=0;

  }
}
//クエリのテキストからポイントを出力する関数。
function firstPoints(pnt){

    //コンマごとで分割する
    let point_texts =pnt.split(/,/gim)
    console.log(point_texts)

    points_data =[]
    links =[]

    let k =0

    //改行の分だけループする 0行は見出しなので別枠の関数もしくは使用しない、
    for (let i =0; i <(point_texts.length-1)/3;i++){
        points_data.push({name:point_texts[3*i],x_co:Number(point_texts[3*i+1]),y_co:Number(point_texts[3*i+2]),num:i+k})
    }
  }
  //線を記載する
  function firstLines(ln){
    let links_texts =ln.split(/,/gim)
    links =[]
    for (let i =0; i <(links_texts.length-1)/2;i++){
        links.push([{name:points_data[Number(links_texts[2*i])].name,x_co:points_data[Number(links_texts[2*i])].x_co,
          y_co:points_data[Number(links_texts[2*i])].y_co,num:points_data[Number(links_texts[2*i])].num},
          {name:points_data[Number(links_texts[2*i+1])].name,x_co:points_data[Number(links_texts[2*i+1])].x_co,
            y_co:points_data[Number(links_texts[2*i+1])].y_co,num:points_data[Number(links_texts[2*i+1])].num}
        ])
    }
    console.log(links)
  }


function zoomed() {


  svg.selectAll("circle").data(points)
  .attr("r",points_size/d3.event.transform.k)
  .attr("transform", d3.event.transform);

  svg.selectAll(".point_texts").data(points)
  .attr("font-size",font_size/d3.event.transform.k)
  .attr("x",function(d){return x(d.x_co)+10/d3.event.transform.k;})
  .attr("y",function(d){return y(d.y_co)+10/d3.event.transform.k;})
  .attr("transform", d3.event.transform);

  //svg.selectAll(".links_line").data(links).attr("transform", d3.event.transform)
//  .style("stroke-width",line_width/d3.event.transform.k);

  //svg.selectAll(".links_line_text").data(links).attr("transform", d3.event.transform)
//  .attr("font-size",font_size_num/d3.event.transform.k)
//  .attr("transform", d3.event.transform);
  gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
  gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));

  svg
  .selectAll(".areas_text")
  .attr("font-size",font_size_num/d3.event.transform.k)
  .attr("transform", d3.event.transform);

  svg
  .selectAll(".areas_line")
  .attr("transform", d3.event.transform)
  .style("stroke-width",line_width/d3.event.transform.k);
  svg
  .selectAll(".links_line")
  .attr("transform", d3.event.transform)
  .style("stroke-width",line_width/d3.event.transform.k);

  svg.selectAll(".links_line_text").attr("transform", d3.event.transform)
  .attr("font-size",font_size_num/d3.event.transform.k)
  .attr("transform", d3.event.transform);



  //重くなりそうな処理、角度をforloopでとる
  for(let i = 1;i <=points.length;i++){
    svg.selectAll(".angle_texts"+points[i-1].num)
    //svg.selectAll(`.angle_texts${points[i-1].num}`)
    .attr("font-size",font_size_num/d3.event.transform.k)
    .attr("transform", d3.event.transform);
  }

  x_move = d3.event.transform.x
  y_move = d3.event.transform.y
  bairitsu = d3.event.transform.k

}
//ポイントを消す処理
//ここの参照はポイントのリストで書く。
function deletePoints(point_num_list){
  for(let i=0;i<point_num_list.length;i++){
    for(let j=0;j<points_data.length;j++){
      if(point_num_list[i]==points_data[j].num){
        points_data.splice(j,1)
      }
    }
  }
  console.log(points_data)
  points = translateDataToPoints(points_data,sokuryo_math)

  $('svg').empty()
  drawFigure()
  $('table').empty()
  makeList(points_data)
}

//測量モードに切り替えるための関数、参照わたしになっており未了
function translateDataToPoints(points_data,sokuryo_math){
  let points = []
  if(sokuryo_math=="sokuryo"){
    for(let i=0;i<points_data.length;i++){
      let a_point ={name:points_data[i].name,x_co:points_data[i].y_co,y_co:points_data[i].x_co,num:points_data[i].num}
      points.push(a_point)
    }
  }
    else{
        for(let i=0;i<points_data.length;i++){
      let a_point ={name:points_data[i].name,x_co:points_data[i].x_co,y_co:points_data[i].y_co,num:points_data[i].num}
      points.push(a_point)
    }
  }



  return points
}



function createNewPoint(x_co,y_co,name){
  console.log(x_co)
  //ポイントのデータがないときに処理ができるようifを変える。
  if(points_data.length ==0){
    let new_point_data ={name:name,x_co:Number(x_co),y_co:Number(y_co),num:1}
    points_data.push(new_point_data)
  }else{
    let new_num = points_data[points_data.length-1].num +1
    let new_point_data ={name:name,x_co:Number(x_co),y_co:Number(y_co),num:new_num}
    points_data.push(new_point_data)
  }
  translateDataToPoints(points_data,sokuryo_math)
  //リストに反映
  $('table').empty()
  makeList(points_data)
  $('svg').empty()
  drawFigure()
  $('select').empty()
  makePullDown()
}

//リストから面積を図形の中心に描写する関数
function drawArea(points_list){
  let centroid = calCentroid(points_list)
  let area = calArea(points_list)
  console.log(centroid)
  console.log(area)
  //ここから面積を記載するためのd3の表記をする。
  svg.select(".areas")
  //.selectAll(".texts")
  .append("text")
  .attr("class","areas_text")
  .attr("fill","#1fde9b")
  .attr("x",x(centroid.x_co))
  .attr("y",y(centroid.y_co))
  .text(rounding(area,floor_or_round,digit))
  .attr("font-size",font_size_num/bairitsu)
  .attr("transform", "translate(" + x_move + "," + y_move + ") scale(" + bairitsu + ")");

}

//重心を計算する関数
function calCentroid(points_list){
  let centroid_x_co = 0
  let centroid_y_co = 0
  for(let i=0;i<points_list.length;i++){
    centroid_x_co += points_list[i].x_co
    centroid_y_co += points_list[i].y_co
  }
  centroid_x_co =centroid_x_co/points_list.length
  centroid_y_co = centroid_y_co/points_list.length
  return {x_co:centroid_x_co,y_co:centroid_y_co}
}

//点のリストから面積を計算する関数
function calArea(points_list){
  let area = 0
  console.log(points_list.length)
  if(points_list.length>2){
    //座標法で面積を計算する
    area += points_list[0].x_co*(points_list[1].y_co-points_list[points_list.length-1].y_co)/2
    for(let i = 1;i<points_list.length-1;i++){
      area += points_list[i].x_co*(points_list[i+1].y_co-points_list[i-1].y_co)/2
    }
    area += points_list[points_list.length-1].x_co*(points_list[0].y_co-points_list[points_list.length-2].y_co)/2
  }

  return Math.abs(area)
}

function calDistance(point1,point2){
  let distance =Math.pow((Math.pow((point1[0]-point2[0]),2)+Math.pow((point1[1]-point2[1]),2)),0.5)
  return distance
}

//lineは関数 ax+by+c=0を用いる
function calDistancePointAndLine(point1,line_function){
  let distance =  Math.abs(point1.x_co*line_function.a+point1*line_function.b+line_function.c)
  /Math.cbrt(Math.pow(line_function.a,2)+Math.pow(line_function.b,2))
  return distance
}

//リンク版を作る(試作品)
function drawPerpendicular(){
  console.log(perpendicular_links)
  //グループ化の処理を加える
  svg.append("g").attr("class","perpendicular_line");

  svg

  .select(".perpendicular_line")
  .selectAll(".links_line")
  .data(perpendicular_links)
  .enter()
  .append("line")

  .attr("class","links_line")
  .style("stroke", "#1fde9b")
  .style("stroke-width",line_width/bairitsu)
  .attr("x1",function(d){return x(d[0].x_co);} )
  .attr("x2",function(d){return x(d[2].x_co);})
  .attr("y1",function(d){return y(d[0].y_co);})
  .attr("y2",function(d){return y(d[2].y_co);})
  .attr("transform", "translate(" + x_move + "," + y_move + ") scale(" + bairitsu + ")")
  .on("mouseover",function(d){
    if(delete_mode){


      svg.select(".perpendicular_line").remove()
      perpendicular_links=[]
      //ここに線を消す処理
    }
  }
);

svg

.select(".perpendicular_line")
.selectAll(".links_line_text")
.data(perpendicular_links)
.enter()
.append("text")
//.selectAll(".perpendicular_line_text")
.attr("class","links_line_text")
.style("fill", "#1fde9b")
.attr("font-size",font_size_num/bairitsu)
.attr("x",function(d){return x((d[0].x_co+d[2].x_co)/2);})
.attr("y",function(d){return y((d[0].y_co+d[2].y_co)/2);})
.text(function(d){return rounding(calDistance([d[0].x_co,d[0].y_co],[d[2].x_co,d[2].y_co]),floor_or_round,digit);})
.attr("transform", "translate(" + x_move + "," + y_move + ") scale(" + bairitsu + ")");

}

//lineは関数 ax+by+c=0を用いる
function calCrossPoint(line_function1,line_function2){
  let cross_x =(-line_function2.b*line_function1.c+line_function1.b*line_function2.c)
  /(line_function1.a*line_function2.b-line_function1.b*line_function2.a)
  let cross_y =(line_function2.a*line_function1.c-line_function1.a*line_function2.c)
  /(line_function1.a*line_function2.b-line_function1.b*line_function2.a)

  //エラー(交わらない場合)の処理も考える

  return {name:"tmp",x_co:cross_x,y_co:cross_y,num:-1}
}

//二点の点から
//linkは[{},{}]みたいな形を想定、切片と傾きタイプの表記方法
function linkConbersionFunction_ver2(link){
  if (link[0].x_co !=link[1].x_co){
    let tilt = (link[0].y_co-link[1].y_co)/(link[0].x_co-link[1].x_co)
    let intercept = link[0].y_co-link[0].x_co*tilt
    return {tilt_infinity:false,tilt:tilt,intercept:intercept};
  }else{
    return {tilt_infinity:true,x:link[0].x_co}
  }
}

//ax+by+c=0の形で出力、こっちの方が使いやすいので、こちらをメインで
function linkConbersionFunction(link){
  if (link[0].x_co !=link[1].x_co){
    let tilt = (link[0].y_co-link[1].y_co)/(link[0].x_co-link[1].x_co)
    let intercept = link[0].y_co-link[0].x_co*tilt
    return {a:tilt,b:-1,c:intercept};
  }else{
    return {a:1,b:0,c:-link[0].x_co}
  }
}

//0から2piで角度を求める関数(ラジアン表記)
function calAngle(point1,point2){
  let angle12 = 0
  if(point2.x_co-point1.x_co<0){
    angle12 = Math.atan((point2.y_co-point1.y_co)/(point2.x_co-point1.x_co))+Math.PI
  }
  else if(point2.x_co-point1.x_co==0){
    if(point2.y_co-point1.y_co<0){
      angle12 =Math.PI*1.5
    }else{angle12=Math.PI/2}
  }
  else{
    if(point2.y_co-point1.y_co<0){
      angle12 =Math.atan((point2.y_co-point1.y_co)/(point2.x_co-point1.x_co))+Math.PI*2
    }else{
      angle12 =Math.atan((point2.y_co-point1.y_co)/(point2.x_co-point1.x_co))
    }

  }
  return angle12
}
//指定した点から、角度と距離を入力すると新点を出す計算(極座標計算)
function calNewPointPolar(point,angle,distance){
  let p_x_co =point.x_co+distance * Math.cos(angle)
  let p_y_co =point.y_co+distance *Math.sin(angle)
  return {name:"tmp",x_co:p_x_co,y_co:p_y_co,num:-1}
}

function drawAreaLine(point1,point2){

  svg
  .select(".areas")
  .append("line")
  .attr("class","areas_line")
  .style("stroke", "#1fde9b")
  .style("stroke-width",line_width/bairitsu)

  .attr("x1",function(d){return x(point1.x_co);})
  .attr("x2",function(d){return x(point2.x_co);})
  .attr("y1",function(d){return y(point1.y_co);})
  .attr("y2",function(d){return y(point2.y_co);})
  .attr("transform", "translate(" + x_move + "," + y_move + ") scale(" + bairitsu + ")")

}

//ラジアン表記で3つの点の角度を示す関数
function calAngle3(point1,point2,point3){
  angle21 = calAngle(point2,point1)
  angle23 = calAngle(point2,point3)

  angle123 = Math.abs( angle23- angle21)

  return angle123
}

function resetted() {
  svg.transition()
  .duration(750)
  .call(zoom.transform, d3.zoomIdentity);
}

//線を引く関数
function drawLine(links){
  svg
  .select(".lines")
  .selectAll(".links_line")
  .data(links)
  .enter()
  .append("line")
  .attr("class","links_line")
  .style("stroke", "#111")
  .style("stroke-width",line_width/bairitsu)

  .attr("x1",function(d){return x(d[0].x_co);})
  .attr("x2",function(d){return x(d[1].x_co);})
  .attr("y1",function(d){return y(d[0].y_co);})
  .attr("y2",function(d){return y(d[1].y_co);})
  .attr("transform", "translate(" + x_move + "," + y_move + ") scale(" + bairitsu + ")")
  .on("mouseover",function(d){
    if(delete_mode){

      let k =1000
      //d3.select(this).remove()
      console.log(d)
      for(let i=0;i<links.length;i++){
        if((d[0].num==links[i][0].num)&&(d[1].num==links[i][1].num)){
          k = i;
        }
      }

      links.splice(k,1);
      //かなりスマートじゃない処理
      svg.select(".lines").selectAll(".links_line").remove()
      svg.select(".lines").selectAll(".links_line_text").remove()
      //svg.selectAll(`.angle_texts${d[0].num}`).remove()

      //svg.selectAll(`.angle_texts${d[1].num}`).remove()
      svg.selectAll(".angle_texts"+d[0].num).remove()
      svg.selectAll(".angle_texts"+d[1].num).remove()
      drawLine(links)
      autoDrawAngle(d[0],links,angle_notation);
      autoDrawAngle(d[1],links,angle_notation);

      //ここに線を消す処理
    }
  })
  .on("click",function(d){
    if(save_point[0]){
      //同じでないことを確認の上、perpendicularlinksに加える
      if(!judgeSamePerpendicularLink([save_point[1],d],perpendicular_links)){
        let link_function = linkConbersionFunction(d)
        //リンクと鉛直方向に仮点を一点作る
        let new_tmp_point = {name:"tmp",x_co:save_point[1].x_co+link_function.a,y_co:save_point[1].y_co+link_function.b,num:-1}
        let tmp_link_function = linkConbersionFunction([save_point[1],new_tmp_point])
        let cross_point = calCrossPoint(link_function,tmp_link_function)
        perpendicular_links.push([save_point[1],d,cross_point])
        drawPerpendicular()
      }
      save_point[0]=false
      svg.selectAll("circle").style("fill","black")

    }

  })

  //ここは線に付随する文字を引く関数

  svg.select(".lines").select(".texts").selectAll(".links_line_text")
  .data(links).enter().append("text").attr("class","links_line_text")
  .attr("font-size",font_size_num/bairitsu)
  .attr("x",function(d){return x((d[0].x_co+d[1].x_co)/2)})
  .attr("y",function(d){return y((d[0].y_co+d[1].y_co)/2)})
  .text(function(d){return rounding(calDistance([d[0].x_co,d[0].y_co],[d[1].x_co,d[1].y_co]),floor_or_round,digit)})
  .attr("transform", "translate(" + x_move + "," + y_move + ") scale(" + bairitsu + ")");
  //ズームの処理をさせることによって新線もzoomに乗るようにしている
}

function judgeSamePerpendicularLink(save_perpendicular,perpendicular_links){
  let hantei =false
  for(var i =0;i<perpendicular_links.length;i++){

    if((save_perpendicular[0].num ==perpendicular_links[i][0].num)&
    (save_perpendicular[1][0].num==perpendicular_links[i][1][0].num)&
    (save_perpendicular[1][0].num==perpendicular_links[i][1][0].num)){
      hantei = true
    }
  }
  return hantei
}


function angle_max_180(angle1,angle2){
  //360度以上のとき360度以下になるよう引く式

  if(angle2 >2*Math.PI){
    for(let i =1; angle2-2*Math.PI>0;){
      angle2 = angle2 -2*Math.PI
    }
  }
  if(angle1 >2*Math.PI){
    for(let i =1; angle1-2*Math.PI>0;){
      angle2 = angle2 -2*Math.PI
    }
  }
  let angle =angle2- angle1

  if(angle>Math.PI){
    angle = 2*Math.PI-angle;

  }

  return {size:angle,start:angle1,goal:angle2}
}

//一つの点から2つ以上線が出ていることを判定し角度を書く関数
function autoDrawAngle(point,links,mode){

  var point_lines =[];
  for(let i = 0;i<links.length;i++){
    if(links[i][0].num==point.num){
      point_lines.push(links[i][1])
    }
    if(links[i][1].num==point.num){
      point_lines.push(links[i][0])
    }
  }
  let point_angles=[]
  if(point_lines.length>1){
    for(let i=0;i<point_lines.length;i++){
      point_angles.push(calAngle(point,point_lines[i]))
    }
    //角度を小さい順に並べ変える
    point_angles.sort(function(a,b){
      return a -b;
    });
    //隣あう角度を計算する180度(πラジアン)以上なら2π-角度
    //扇形を書き出すためのデータを作る
    let each_angles = []

    for(let i=1;i<point_angles.length;i++){
      each_angles.push(angle_max_180(point_angles[i-1],point_angles[i]))
    }
    each_angles.push(angle_max_180(point_angles[0],point_angles[point_angles.length-1]))

    console.log(each_angles);


    //角度が3つ以上あるなら一番大きい角度を非表示にする処理
    let max_angle_number =0
    for(let i=1;i< each_angles.length;i++){
      if(each_angles[i].size>=each_angles[max_angle_number].size){
        max_angle_number =i
      }
    }
    each_angles.splice(max_angle_number,1)
    console.log(each_angles)

    //過去に書いた角度を消す処理
    //$(`.angle_texts${point.num}`).remove()
    $(".angle_texts"+point.num).remove()
    //上の情報をもとに角度を書き出す。扇型と数字かな
    //svg.data(each_angles).enter().append("g").append("path").attr("d",)
    //数字,ここで角度のテキスト共通のクラス表記できないかな

    //svg.select(".angles").selectAll(`.angle_texts${point.num}`).data(each_angles).enter().append("text")
    svg.select(".angles").selectAll(".angle_texts"+point.num).data(each_angles).enter().append("text")
    //.attr("class",`angle_texts${point.num}`)
    .attr("class","angle_texts"+point.num)
    .attr("fill","blue")
    .attr("x",function(d){let i = 1;
      if((d.goal-d.start)>Math.PI){i =-1};
      return x(point.x_co)+40*i*Math.cos((d.goal+d.start)/2)/Math.pow(bairitsu,0.7)
    })
    .attr("y",function(d){let i = 1;
      if((d.goal-d.start)>Math.PI){i =-1};
      return y(point.y_co)-40*i*Math.sin((d.goal+d.start)/2)/Math.pow(bairitsu,0.7)}
    )
    .text(function(d){return translateAngle(d.size,mode,digit)})
    .attr("font-size",font_size_num/bairitsu)
    .attr("transform", "translate(" + x_move + "," + y_move + ") scale(" + bairitsu + ")");
    //扇形



    //  <path d="M 13,8 L 91,-37 a 90 90 -30 0 1 0,90 z" fill="red" stroke="black"/>
    //var arc = d3.arc();
    //arc({
    //    innerRadius: 0,
    //    outerRadius: 100,
    //  });
    //  svg.selectAll("arcs").data(each_angles).enter().append("path").attr("d",arc)
  }
}


function translateFunByou(degree,fun,byou){
  let radian_angle =  (degree+fun/60+byou/3600)/180*Math.PI

  return radian_angle
}
//ラジアン、ラジアンPI、度数法10進法の角度を弧度法に直す角度
function translateAngle2(angle_size,mode){
  if(mode == "radian"){
    return angle_size
  }
  if(mode == "radian_pi"){
    return angle_size*Math.PI
  }
  if(mode == "dosuhou_10shin"){
    return angle_size/180*Math.PI
  }
}

//modeは0がラジアン、1が分秒表記、2が少数表記
function translateAngle(angle_size,mode,round_digits){
  let result = ""
  if(mode == "radian"){
    //result = `${round(angle_size,round_digits)}rad`
    result = round(angle_size,round_digits)+"rad"
  }
  if(mode == "dosuhou_fun"){
    let angle_degree_size = angle_size*180/Math.PI
    //result = `${Math.floor(angle_degree_size)}°${Math.floor((angle_degree_size-Math.floor(angle_degree_size))*60)}'
    //${Math.round((angle_degree_size*60-Math.floor(angle_degree_size*60))*60)}"`
    result = Math.floor(angle_degree_size)+"°"+Math.floor((angle_degree_size-Math.floor(angle_degree_size))*60)+"\'"+
    Math.round((angle_degree_size*60-Math.floor(angle_degree_size*60))*60)

  }
  if(mode == "dosuhou_10shin"){
    let angle_degree_size = angle_size*180/Math.PI
    //  result =`${round(angle_degree_size,round_digits)}°`
    result =round(angle_degree_size,round_digits)+"°"
  }
  if(mode == "radian_pi"){

    //  result = `${round(angle_size/Math.PI,round_digits)}π rad`
    result = round(angle_size/Math.PI,round_digits)+"π rad"
  }

  return result
}
//floor_or_round floorが切り捨て、roundが四捨五入 floor_or_roundはfloorかroundか
function rounding(length,floor_or_round ,round_digits){
  let result = 0
  if(floor_or_round=="floor"){
    result = Math.floor(length*Math.pow(10,round_digits))/Math.pow(10,round_digits)
  }
  if(floor_or_round =="round"){
    result = round(length,round_digits)
  }
  return   result
}

//右のサイトを利用　https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/round
function round(number, precision) {
  var shift = function (number, precision, reverseShift) {
    if (reverseShift) {
      precision = -precision;
    }
    var numArray = ("" + number).split("e");
    return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
  };
  return shift(Math.round(shift(number, precision, false)), precision, true);
}

function judgeSameLink(save_link,links){
  let hantei =false
  for(var i =0;i<links.length;i++){

    if((save_link[0].num ==links[i][0].num)&(save_link[1].num)==links[i][1].num){
      hantei = true

    }
  }
  return hantei
}

//新たに命名する名前にダブりがあった場合-1,-2....をつける関数
function nameAdjust(name){
  let adname = name
  for(let i in points){
    //同じ文字列があるか判断
    if (adname ==points[i].name){
      console.log("onaji")
      //-nになっているか判断
      //正規表現で-nを探索
      let haifunn =/-\d+$/gm
      let haifunn2 =/\d+$/gm
      if(haifunn.test(adname)){
        console.log("12234")
        adname = adname.replace(haifunn2,String(Number(adname.match(haifunn2))+1))
      }else{
        adname = name +"-1"
      }
    }
  }


  return adname
}
//データをアップロードする関数。重くならないか不安
function linksDataUpdate(){
  for(let i in links){
    for(let j in points){
      if(points[j].num == links[i][0].num){
        links[i][0].name =points[j].name
        links[i][0].x_co =points[j].x_co
        links[i][0].y_co =points[j].y_co
      }
      if(points[j].num == links[i][1].num){
        links[i][1].name =points[j].name
        links[i][1].x_co =points[j].x_co
        links[i][1].y_co =points[j].y_co
      }
    }
  }
}
//リセット後に最初にやる処理をまとめる、線よりも点(circle)が上に来るように改良する。
function drawFigure(){


//未、順番を決めるための下地を作る。なんかいい方法ないかな。
  points = translateDataToPoints(points_data,sokuryo_math)
  linksDataUpdate()
  drawGrid()
  drawPerpendicular()
  drawLine(links);
  plotPoints();
  for(let i=0; i<points.length;i++){
    autoDrawAngle(points[i],links,angle_notation);
  }
  svg.call(zoom);
  //現在の倍率位置に移動するコードを入れる
  svg.call(zoom.transform,d3.zoomIdentity.translate(x_move,y_move).scale(bairitsu))

  if(dispinfo[0]==0){
  unvisibleAngle()
}
if(dispinfo[1]==0){
  unvisibleDistance()
}
if(dispinfo[2]==0){
  unvisibleName()
}
if(dispinfo[3]==0){
  unvisibleGrid()
}
if(dispinfo[4]=0){
  hover_mode =false
}
}
//これを場づくりの個所とプロットの個所に分割
function drawGrid(){
  xmax = d3.max(points, function(d) { return d.x_co; })
  xmin = d3.min(points, function(d) { return d.x_co; })
  ymax = d3.max(points, function(d) { return d.y_co; })
  ymin = d3.min(points, function(d) { return d.y_co; })

  //x,y0,1点の場合の例外処理を仕組む
  if(points.length==0){
    xmax=0
    xmin=0
    ymax=0
    ymin=0
  }

  if(xmax==xmin){
    xmax += 1
    xmin -= 1
  }
  if(ymax==ymin){
    ymax+=1
    ymin-=1
  }

  x_y=(xmax-xmin)/(ymax-ymin)

  let x_chose = 1
  let y_chose = 1
  if (width/height>x_y){
    x_chose = width/height/x_y
  }else{
    y_chose =height/width*x_y
  }
  x = d3.scaleLinear()
  .domain([0.6*x_chose*(xmin-xmax)+(xmax+xmin)*0.5,0.6*x_chose*(xmax-xmin)+(xmax+xmin)*0.5])
  .range([0, width]);
  y = d3.scaleLinear()
  .domain([0.6*y_chose*(ymin-ymax)+(ymax+ymin)*0.5,0.6*y_chose*(ymax-ymin)+(ymax+ymin)*0.5])
  .range([height, 0]);

  arcX=d3.scaleLinear()
  .domain([0, width])
  .range([0.6*x_chose*(xmin-xmax)+(xmax+xmin)*0.5,0.6*x_chose*(xmax-xmin)+(xmax+xmin)*0.5])
  ;
  arcY = d3.scaleLinear()
  .domain([height, 0])
  .range([0.6*y_chose*(ymin-ymax)+(ymax+ymin)*0.5,0.6*y_chose*(ymax-ymin)+(ymax+ymin)*0.5])
  ;



  /*
  width = length_standard*x_y
  height = length_standard;
  */

  svg = d3.select("svg")
  //  .attr("viewBox", [0, 0, width+1, height+1]);
  .attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);


  valueline = d3.line()
  .x(function(d) { return x(d.x_co); })
  .y(function(d) { return y(d.y_co); });


  //透明の正方形を座標内に追加
  svg.append("rect")       // attach a polygon
  .style("stroke", "none")  // colour the line
  .style("fill", "none")     // remove any fill colour
  .attr("width", width+ margin.left + margin.right)
  .attr("height",height + margin.top + margin.bottom)
  .attr("pointer-events","all")

  .on("mousedown",function(d){
    if(event.button != 0){
      delete_mode = true
      console.log("delete")
    }
  })
  .on("mouseup",function(d){
    delete_mode =false
    console.log("kaijo")
  })
  //正方形をクリックした時の動き、ここでクリックした座標を取得
  .on("click",function(d){
    console.log("click")
    if(click_input_mode){
    let position = d3.mouse(this)
    let transform = d3.zoomTransform(this)
    let zoomhosei = transform.invert(position);
    //逆関数を作ることでクリックした座標を変換する。
    let click_point = [arcX(zoomhosei[0]),arcY(zoomhosei[1])]
    console.log(click_point)
    let np_name ="新点"
    np_name =nameAdjust(np_name)

    //測量モードの時逆にならないように条件で分ける
    if(sokuryo_math =="sokuryo"){
      createNewPoint(click_point[1],click_point[0],np_name)
    }else{
    createNewPoint(click_point[0],click_point[1],np_name)
  }
}
  })

  xAxis = d3.axisBottom(x)
  .ticks(width / height * 10)
  .tickSize(height)
  .tickPadding(8 - height);

  yAxis = d3.axisRight(y)
  .ticks(10)
  .tickSize(width)
  .tickPadding(8 - width);

  gX = svg.append("g")
  .attr("class","grid")
  .call(xAxis);
  gY = svg.append("g")
  .attr("class","grid")
  .call(yAxis);
  svg.append("g")
  .attr("class","areas");
  svg.append("g")
  .attr("class","lines");
  svg.select(".lines")
  .append("g")
  .attr("class","texts");


  svg.append("g")
  .attr("class","points");
  svg.select(".points")
  .append("g")
  .attr("class","texts");
  svg.append("g")
  .attr("class","angles");

}

function calMidpoint(point1,point2){

return {name:"tmp",x_co:(point1.x_co+point2.x_co)/2,y_co:(point1.y_co+point2.y_co)/2,num:-1}

}


function plotPoints(){

//ポイントの名前
  svg.select(".points")
  .select(".texts")
  .selectAll("dot")
  .data(points)
  .enter().append("text")
  .attr("font-size",font_size)
  .attr("class","point_texts")
  .attr("x",function(d){return x(d.x_co)+10;})
  .attr("y",function(d){return y(d.y_co)+10;})
  //.text(function(d){return d.name;});
  .text(function(d){return d.name;})

  svg.select(".points")
  .selectAll("dot")
  .data(points)
  .enter().append("circle")
  .attr("r",points_size)
  .attr("cx",function(d){return x(d.x_co);})
  .attr("cy",function(d){return y(d.y_co);})
  .style("fill","black")
  .attr("id",function(d){return d.num})
  //ここはカーソルでふれたときに出るホバーの作成
  .on("mouseover", function(d) {
    if(hover_mode){
      div.transition()
      .duration(100)
      .style("opacity", .9);
      if(sokuryo_math=="sokuryo"){
        div.html("("+d.y_co + "," + d.x_co+")")
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
      }else{
        div.html("("+d.x_co + "," + d.y_co+")")
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
      }
    }
  })
  .on("mouseout", function(d) {
    div.transition()
    .duration(100)
    .style("opacity", 0);
  })


  svg.selectAll("circle").on("click",function(d){
    //editmodeが面積計算の場合分け



    if(edit_mode=="cal_area"){
      //エリアリンクで同じ点がないか確認する。
      let hantei = true
      if(area_link.length){
        if(area_link[0].num==d.num){
          hantei =false
          drawArea(area_link)
          drawAreaLine(area_link[0],area_link[area_link.length-1])
          area_link=[]
        }else{
          for(let i =1;i<area_link.length;i++){
            if(d.num == area_link[i].num){
              hantei =false
            }}
          }
        }
        if(hantei){
          d3.select(this).style("fill","#1fde9b");
          area_link.push({name:d.name,x_co:d.x_co,y_co:d.y_co,num:d.num})
          if(area_link.length>1){
            drawAreaLine(area_link[area_link.length-2],area_link[area_link.length-1])
          }
          console.log(area_link)
        }
      }else{
        //save_point関数のTFで処理を変える
        if(save_point[0]){
          svg.selectAll("circle").style("fill","black")
          if(save_point[1].num<d.num){
            save_link = [save_point[1],{name:d.name,x_co:d.x_co,y_co:d.y_co,num:d.num}]
          }
          if(save_point[1].num>d.num){
            save_link = [{name:d.name,x_co:d.x_co,y_co:d.y_co,num:d.num},save_point[1]]
      }
      //ここはセーブリンクを確認する場所、セーブリンクが0だとエラーになる。
      if(save_link.length){

        if(!(judgeSameLink(save_link,links))){
        links.push(save_link);
        drawLine(links);
        autoDrawAngle(save_point[1],links,angle_notation)
        autoDrawAngle({name:d.name,x_co:d.x_co,y_co:d.y_co,num:d.num},links,angle_notation)

      }
    }
      //線を描く関数を入れる
      save_link =[]
      save_point[0]=false
      console.log(links)
    }else{
      d3.select(this).style("fill","blue");

      save_point[0] = true;
      save_point[1] = {name:d.name,x_co:d.x_co,y_co:d.y_co,num:d.num};
      console.log(save_point);
    }

  }})
//  drawPerpendicular({name:"b",x_co:10,y_co:120,num:2},
//  [{name:"a",x_co:-810,y_co:1,num:1},{name:"c",x_co:50,y_co:80,num:3}])
}


function areaDelete(){

  $(".areas").empty();
  area_link=[]
  svg.select(".points")
  .selectAll("circle")
  .style("fill","black");
}

function newFigure(){
  $('svg').empty()

width = window.innerWidth -580;
if(width<400){width= window.innerWidth*0.9}
if(printing_mode[0]){
  width = printing_mode[1].width
  height = printing_mode[1].height
}

  drawFigure()
}


let query ={
    "ver": "",
    "opt": "",
    "pnt": "",
    "ln":""
}

try{
   query = queryprCut(querypr)
}catch{
console.log("不正なクエリパラメータです")
}
console.log(query)
if(query.ver){
  try{
  firstOption(query.opt)
  firstPoints(query.pnt)
  firstLines(query.ln)
}catch{
  console.log("不正なクエリパラメータです")
}
}

window.onresize=newFigure;

$('svg').empty()
drawFigure()
