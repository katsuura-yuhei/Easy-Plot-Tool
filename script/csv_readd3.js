
let points = [];
var pointA=[1,1] ;
var pointB =[3,2] ;




function calDistance(point1,point2){
  distance =((point1[0]-point2[0])**2+(point1[1]-point2[1])**2)**0.5

  return distance
}

//0から2piで角度を求める関数(ラジアン表記)
function calAngle(point1,point2){
  if(point2[0]-point1[0]<0){
  angle12 = Math.atan((point2[1]-point1[1])/(point2[0]-point1[0]))+Math.PI
}
  else if(point2[0]-point1[0]==0){
  if(point2[1]-point2[1]<0){
    angle12 =Math.PI*1.5
  }else{angle12=Math.PI/2}
}
  else{
    if(point2[1]-point1[1]<0){
      angle12 =Math.atan((point2[1]-point1[1])/(point2[0]-point1[0]))+Math.PI*2
  }else{
    angle12 =Math.atan((point2[1]-point1[1])/(point2[0]-point1[0]))
  }

  }
return angle12
}
//ラジアン表記で3つの点の角度を示す関数
function calAngle3(point1,point2,point3){
angle21 = calAngle(point2,point1)
angle23 = calAngle(point2,point3)

angle123 = Math.abs( angle23- angle21)

  return angle123
}


//x,y座標の最大値最小値を求める


//ここをCSV読み込みの結果に変更する
//以下1行の　v4仕様
//d3.csv("dataset.csv",function(error,data){
//  if (error) throw error;
d3.csv("dataset.csv").then(function(data){
  // format the data
  data.forEach(function(d) {
    d.name =d.name;
    d.x_co = +d.x_co;
    d.y_co = +d.y_co; //+は数字と認識されることを確実にするため
  });
  //console.log(data)

  //x軸y軸が一対一になるような調整
  xmax = d3.max(data, function(d) { return d.x_co; })
  xmin = d3.min(data, function(d) { return d.x_co; })
  ymax = d3.max(data, function(d) { return d.y_co; })
  ymin = d3.min(data, function(d) { return d.y_co; })
  x_y=(xmax-xmin)/(ymax-ymin)
  length_standard = 900/x_y
  if (length_standard>600){
    length_standard =600
  }

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = length_standard*x_y,
      height = length_standard;

  // parse the date / time

  /*var links =[{source:{name:"c",x_co:1,y_co:1},target:{name:"d",x_co:2,y_co:2}},
  {source:{name:"a",x_co:1,y_co:2},target:{name:"b",x_co:3,y_co:2}},
  {source:{name:"b",x_co:3,y_co:2},target:{name:"c",x_co:1,y_co:1}}];
*/
  var links =[]
  var save_point =[false,{name:"",x_co:0,y_co:0}]


  //ここはまだ使っていない使えるかな？
  var point_info = data.name
      console.log(data)


  // set the ranges
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  var valueline = d3.line()
      .x(function(d) { return x(d.x_co); })
      .y(function(d) { return y(d.y_co); });
  //divの宣言をする。
  var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin



  var svg = d3.select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  var link =  svg.selectAll("line")
  .data(links)
  .enter()
  .append("line")
  .attr("class", "links_line")
  .style("stroke", "black")

  //zoom機能を実装できるか？
 /*
  var zoom = d3.zoom()
    .scaleExtent([1, 40])
    .translateExtent([
      [-100, -100],
      [width + 90, height + 100]
    ])
    .on("zoom", zoomed);

  svg.call(zoom);
*/
  function zoomed() {
    svg.selectAll("dot").data(data)
        .enter().append("circle")
        .attr("r",3)
        .attr("cx",function(d){return x(d.x_co);})
        .attr("cy",function(d){return y(d.y_co);})
        .attr("transform", d3.event.transform);
  }

  function resetted() {
    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity);
  }

  //透明の正方形を座標内に追加
   svg.append("rect")       // attach a polygon
    .style("stroke", "none")  // colour the line
    .style("fill", "none")     // remove any fill colour
    .attr("width", width)
    .attr("height",height)
    .attr("pointer-events","all")


  x.domain(d3.extent(data, function(d) { return d.x_co; }));
  y.domain(d3.extent(data, function(d) { return d.y_co; }));

    //Add the valueline path.→リンクしたものをすべて見せる。
    //svg.append("path")
      //  .data([data])
      //  .attr("class", "line")
      //  .attr("d", valueline);

    svg.selectAll("dot").data(data)
        .enter().append("circle")
        .attr("r",3)
        .attr("cx",function(d){return x(d.x_co);})
        .attr("cy",function(d){return y(d.y_co);})
//ここはマウスをクリックしたときに出るホバーの作成
        .on("mouseover", function(d) {
    div.transition()
      .duration(100)
      .style("opacity", .9);
    div.html("("+d.x_co + "," + d.y_co+")")
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
    })
  .on("mouseout", function(d) {
    div.transition()
      .duration(100)
      .style("opacity", 0);
      console.log("nnn")
    });

    //ドットをドラッグするとlinksが変わり線を引けるようなコードを書く。
    //1.ドットから線を表示するコード
var tensenkiten =[-1,-1]
var tensenshuten =[-1,-1]
svg.append("line")
.attr("x1",tensenkiten[0])
.attr("y1",tensenkiten[1])
.attr("x2",tensenshuten[0])
.attr("y2",tensenshuten[1])
.attr("class", "point_line")



    //svg.on("mousedown",function(d){
      //console.log("a")


        //mousemoveで線が変わる位置の処理をすると他が動かなくなる重い？
  /*      svg.on("mousemove",function(d){
        console.log("abc")
        tensenshuten= d3.mouse(this)
        svg.select(".point_line")
        .attr("x1",tensenkiten[0])
        .attr("y1",tensenkiten[1])
        .attr("x2",tensenshuten[0])
        .attr("y2",tensenshuten[1]); })
  */

  console.log(calAngle([1,1],[2,2]))
console.log(calAngle([2,3],[1,2]))
console.log(calAngle([2,3],[1,4]))
console.log(calAngle([1,3],[2,2]))
console.log(calAngle3([1,1],[2,2],[3,1]))

       svg.on("mouseup", function(d) {
          console.log("sss")
          svg.select(".point_line")
          .attr("display","none")

          //この下はリンクを更新した後の線を引く関数

          svg
          .selectAll(".links_line")
          .data(links)
          .enter()
          .append("line")
          .attr("class","links_line")
          .style("stroke", "black")
          .attr("x1",function(d){return x(d.source.x_co);})
              .attr("x2",function(d){return x(d.target.x_co);})
              .attr("y1",function(d){return y(d.source.y_co);})
              .attr("y2",function(d){return y(d.target.y_co);})

          //ここは線に付随する文字を引く関数
          svg.selectAll("dot").data(links).enter().append("text")
      .attr("x",function(d){return x((d.source.x_co+d.target.x_co)/2)})
      .attr("y",function(d){return y((d.source.y_co+d.target.y_co)/2)})
      .text(function(d){return calDistance([d.source.x_co,d.source.y_co],[d.target.x_co,d.target.y_co])})

      //新たに線が追加されたとき2本以上の線が通る点を判断し、隣り合う線同士の角度を記載する関数を入れる
      //if(links[i].source.name == "a"||links[i].target.name =="a"){  }

          });

          svg.selectAll("circle").on("mousedown",function(d){

            console.log(d.x_co)
             tensenkiten = [x(d.x_co),y(d.y_co)]
             tensenshuten =[x(d.x_co),y(d.y_co)]
             svg.select(".point_line")
             .attr("x1",tensenkiten[0])
             .attr("y1",tensenkiten[1])
             .attr("x2",tensenshuten[0])
             .attr("y2",tensenshuten[1])
             .attr("stroke","blue")
             .attr("display","inline")

             //ここにsave_point関数を入れる
             save_point[0] = true
             save_point[1] = {name:d.name,x_co:d.x_co,y_co:d.y_co}
             console.log(save_point)



           })

           svg.selectAll("circle").on("mouseup",function(d){
             tensenshuten =[x(d.x_co),y(d.y_co)]
             if(true){
             //if (!((tensenkiten[0]==tensenshuten[0])&&(tensenkiten[1]==tensenshuten[1]))){
               console.log("線を書く!")
             }
             if(save_point[0]){
               links.push({source:save_point[1],target:{name:d.name,x_co:d.x_co,y_co:d.y_co}})

             }
             save_point[0] = false
             console.log(links)
            })



    link.attr("x1",function(d){return x(d.source.x_co);})
.attr("x2",function(d){return x(d.target.x_co);})
.attr("y1",function(d){return y(d.source.y_co);})
.attr("y2",function(d){return y(d.target.y_co);});

    svg.selectAll("dot").data(links).enter().append("text")
.attr("x",function(d){return x((d.source.x_co+d.target.x_co)/2)})
.attr("y",function(d){return y((d.source.y_co+d.target.y_co)/2)})
.text(function(d){return calDistance([d.source.x_co,d.source.y_co],[d.target.x_co,d.target.y_co])})

    svg.selectAll("dot").data(data)
        .enter().append("text")
        .attr("x",function(d){return x(d.x_co)+10;})
        .attr("y",function(d){return y(d.y_co)+10;})
        //.text(function(d){return d.name;});
        .text(function(d){return d.name;})






    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
      });
