'use strict'
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
let y = d3.scaleLinear()
.domain([0,height])
.range([height, 0]);

let delete_mode = false

let sokuryo_math ="math"
let angle_notation ="dosuhou_fun"


let font_size =20
let font_size_num =15
let line_width = 1.5
let links =[]
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
let x_move = 0
let y_move = 0
let bairitsu = 1

let delete_point_list =[]
let change_point_list =[]
let hover_mode = true
let floor_or_round ="floor"
let digit =3
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
  let new_num = points_data[points_data.length-1].num +1
  let new_point_data ={name:name,x_co:Number(x_co),y_co:Number(y_co),num:new_num}
  points_data.push(new_point_data)
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

//垂線とその長さを記載する関数
function drawPerpendicular(point,link){
let link_function = linkConbersionFunction(link)
//リンクと鉛直方向に仮点を一点作る
let new_tmp_point = {name:"tmp",x_co:point.x_co+link_function.a,y_co:point.y_co+link_function.b,num:-1}
console.log(new_tmp_point)
console.log(point)
console.log(link_function)
let tmp_link_function = linkConbersionFunction([point,new_tmp_point])
let cross_point = calCrossPoint(link_function,tmp_link_function)

console.log(cross_point)
//グループ化の処理を加える
svg.append("g").attr("class","perpendicular_line1");

svg

.select(".perpendicular_line1")
//.selectAll(".perpendicular_line")
.append("line")

.attr("class","links_line")
.style("stroke", "#1fde9b")
.style("stroke-width",line_width/bairitsu)
.attr("x1", x(cross_point.x_co))
.attr("x2",x(point.x_co))
.attr("y1",y(cross_point.y_co))
.attr("y2",y(point.y_co))
.attr("transform", "translate(" + x_move + "," + y_move + ") scale(" + bairitsu + ")")
.on("mouseover",function(d){
  if(delete_mode){


    svg.select(".perpendicular_line1").remove()


    //ここに線を消す処理
  }
}
);

svg

.select(".perpendicular_line1")
.append("text")
//.selectAll(".perpendicular_line_text")
.attr("class","links_line_text")
.style("fill", "#1fde9b")
.attr("font-size",font_size_num/bairitsu)
.attr("x",function(d){return x((cross_point.x_co+point.x_co)/2)})
.attr("y",function(d){return y((cross_point.y_co+point.y_co)/2)})
.text(function(d){return rounding(calDistance([cross_point.x_co,cross_point.y_co],[point.x_co,point.y_co]),floor_or_round,digit)})
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
      drawPerpendicular(save_point[1],d)
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
  console.log(links)

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

//リセット後に最初にやる処理をまとめる、線よりも点(circle)が上に来るように改良する。
function drawFigure(){
  //未、順番を決めるための下地を作る。なんかいい方法ないかな。
  points = translateDataToPoints(points_data,sokuryo_math)

  drawGrid()
  drawLine(links);
  plotPoints();
  for(let i=0; i<points.length;i++){
    autoDrawAngle(points[i],links,angle_notation);
  }
  svg.call(zoom);

}
//これを場づくりの個所とプロットの個所に分割
function drawGrid(){
  xmax = d3.max(points, function(d) { return d.x_co; })
  xmin = d3.min(points, function(d) { return d.x_co; })
  ymax = d3.max(points, function(d) { return d.y_co; })
  ymin = d3.min(points, function(d) { return d.y_co; })
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
  //ここはマウスをクリックしたときに出るホバーの作成
  .on("mouseover", function(d) {
    if(hover_mode){
    div.transition()
    .duration(100)
    .style("opacity", .9);
    div.html("("+d.x_co + "," + d.y_co+")")
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 28) + "px");
  }
  })
  .on("mouseout", function(d) {
    div.transition()
    .duration(100)
    .style("opacity", 0);
  });


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
//  d3.select("svg")
    //  .attr("viewBox", [0, 0, width+1, height+1]);
  //  .attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);

  drawFigure()
}

window.onresize=newFigure;

$('svg').empty()
drawFigure()


console.log(calArea(points))
