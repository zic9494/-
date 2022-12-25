var month_day=[31,28,31,30,31,30,31,31,30,31,30,31]
var chine_day=["日","一","二","三","四","五","六"]
var n_year
var n_month
var n_day
var month_data
var main_window=document.getElementById("main_window")
function link_api(year,month){
  var dataUrl= "http://127.0.0.1:8000/action/school_data?schoolID=tcivs"
  var dataUrl=dataUrl+"&year="+year+"&mon="+month
  var data
  var xhr = new XMLHttpRequest()
  xhr.open('GET',dataUrl,true)
  xhr.send()
  xhr.onload=function(){
    data=xhr.responseText
    data=JSON.parse(data)
    console.log(data)
    var i=0
    while (true){
      var start_days=data.items[i].start.date
      start_days=start_days.split('-')
      start_days=start_days.map(x => parseInt(x))
      var end_day=data.items[i].end.date
      end_day=end_day.split('-')
      end_day=end_day.map(x => parseInt(x))
      if (start_days[1]>month);
    }
  }
}

function today(){
  date=Date.now()
  const dateObj = new Date(date)
  n_year=dateObj.getFullYear()
  n_month=dateObj.getMonth()
  n_day=dateObj.getDate()
  get_now_data()
}

function get_firstday(year,month){
  var d=new Date();
  d.setDate(1)
  d.setFullYear(year)
  d.setMonth(month)
  return d.getDay()
}

function get_now_data(){
  var days
  first_day=get_firstday(n_year,n_month)
  if (n_month==1 && n_year%4==0){
    if (n_year%100==0){
      if (n_year/100%4==0){
        days=29
      }else days=28
    }else days=29
  }else days=month_day[n_month];
  var main=document.getElementById("main_window")
  var caleder='<h1>'+n_year+"年"+(n_month+1)+"月"+'</h1>'+'<button onclick="month_move(-1)"><</button><button onclick="month_move(1)">></button><button onclick="today()">今天</button>'+'<table cellpadding="10px",border="1px solid black",border-collapse="collapse">'
  caleder=caleder+"<tr>"
  for (var i=0;i<7;i++){caleder=caleder+"<td>"+chine_day[i]+"</td>"}
  caleder=caleder+"</tr>"
  var line=5
  if ((first_day==5 && days==31) || first_day==6)line=6
  for (var i=0;i<line;i++){
    caleder=caleder+"<tr>"
    for (var x=0;x<7;x++){
      if (i*7+x<first_day || i*7+x-first_day>=days){
        caleder=caleder+"<td>&nbsp;</td>"
      }else{
        var day=i*7+x-first_day+1
        caleder=caleder+"<td onclick=day_schedule("+day+")>"+day+"</td>"
      }
    }
    caleder=caleder+"</tr>"
  }
  caleder=caleder+"</table><div id='day_schedule'></div>"
  main.innerHTML=caleder
}

function day_schedule(c_day){
  var data=get_cookie("user_data")
  data=JSON.parse(data)
  day=n_year+"/"+(n_month+1)+"/"+c_day
  var data_list=data.Event_day
  var i=-1
  for (var index=0;index<data_list.length;index++)if (data_list[index]==day){i=index;break}
  if (index==(data.length-1) && data[index]!=day)index=-1

  var detal=document.getElementById('day_schedule')
  var str="<h3>To_do list</h3><ul>"
  if (i>-1){
    for (var x=0;x<data.ALL_sce[i].length;x++){
      str=str+"<li><button onclick=del_event("+c_day+","+x+")>-</button>"+data.ALL_sce[i][x].time+" ： "+data.ALL_sce[i][x].event+"</li>"
    }
  }
  str=str+"<li id='add_list'><button onclick='aad_event("+c_day+")'>+</button></li></ul>"
  detal.innerHTML=str
}

function aad_event(day){
  var input=document.getElementById("add_list")
  input.innerHTML="<input type='time' id='tim'><input type='text' id='inp'><button id='sure' onclick='write_event("+day+")'>確定</button>"
  inp.addEventListener("keypress",function(event){
    if (event.key=="Enter"){
      event.preventDefault()
      write_event(day)
    }
  })
}

function write_event(c_day){
  var data=get_cookie("user_data")
  data=JSON.parse(data)
  var day=n_year+'/'+(n_month+1)+'/'+c_day
  var i=-1
  var index
  var data_list=data.Event_day
  for (index=0;index<data_list.length;index++)if (data_list[index]==day){i=index;break}
  console.log(data_list,day)
  if (i!=-1){
    var inp=document.getElementById("inp").value
    var tim=document.getElementById("tim").value
    var chang=data.ALL_sce[index]
    chang.push({"time":tim,"event":inp})
    data.ALL_sce[index]=chang
  }else{
    data_list.push(day)
    var inp=document.getElementById("inp").value
    var tim=document.getElementById("tim").value
    var chang=data.ALL_sce
    chang.push([{"time":tim,"event":inp}])
    data.ALL_sce=chang
    data.Event_day=data_list
  }
  var limit=limit_time()
  var check=data.ALL_sce
  var event=data.Event_day
  if (event.length>30){
    data.ALL_sce=check.slice(10,check.length())
    data.Event_day=event.slice(10,event.length())
  }
  write_cookie("user_data",data,limit)
  setTimeout(save_data(),0)
  get_now_data()
  day_schedule(c_day)
}

function del_event(c_day,index){
  var data=get_cookie("user_data")
  data=JSON.parse(data)
  s_day=n_year+"/"+(n_month+1)+"/"+c_day
  var day=data.Event_day
  var i=-1
  for (var x=0;x<day.length;x++)if(day[x]==s_day){i=x;break};
  var e_data=data.ALL_sce
  if (index==0 && e_data[i].length==1){
    var tmp=[]
    if (i>0)tmp=e_data.slice(0,i)
    tmp=tmp.concat(e_data.slice(i+1,e_data.length))
    console.log(tmp)
    data.ALL_sce=tmp
    
    tmp=[]
    if (i>0)tmp=day.slice(0,i)
    var temp=day.slice(i+1,day.length)
    tmp=tmp.concat(temp)
    data.Event_day=tmp
  }else {
    e_data=e_data[i]
    var tmp=[]
    if (index>0)tmp=e_data.slice(0,index)
    tmp=tmp.concat(e_data.slice(index+1,e_data.lenght))
    data.ALL_sce[i]=tmp
  }
  var limit=limit_time()
  write_cookie("user_data",data,limit)
  get_now_data()
  day_schedule(c_day)
  setTimeout(save_data(),0)
}

function month_move(move){
  n_month=n_month+move
  if (n_month<0){
    n_year-=1;
    n_month+=12
  }else if(n_month>=12){
    n_year+=1;
    n_month-=12
  }
  get_now_data()
}

function get_cookie(kind){
  let decodeCookie=decodeURIComponent(document.cookie)
  let piece=decodeCookie.split(";")
  let data
  if (kind=="user_id")data=piece[0];
  else if (kind=="user_data")data=piece[1];
  kind=kind+'='
  while (data.charAt(0)==' ')data=data.substring(1)
  if (data.indexOf(kind)==0)return data.substring(kind.length,data.length)
}

function write_cookie(name,data,time_limit){
  data=JSON.stringify(data)
  document.cookie=name+"="+data+";"+time_limit
}
function save_data(){
  id=get_cookie("user_id")
  data=get_cookie("user_data")
  data_Url="http://127.0.0.1:8000/action/return_data?ID="+ID+"&data="+data
  var xhr=new XMLHttpRequest()
  xhr.open('GET',data_Url,true)
  xhr.send()
}
function log_in_server(ID,passwd,time_limit){
  data_Url="http://127.0.0.1:8000/action/login?ID="+ID+"&passwd="+passwd
  var xhr=new XMLHttpRequest()
  xhr.open('GET',data_Url,true)
  xhr.send()
  xhr.onload=function(){
    tmp=xhr.responseText
    document.cookie = 'user_id='+ID+";"+time_limit
    document.cookie="user_data="+tmp+";"+time_limit
  }
  
}

function limit_time(){
  const d=new Date()
  d.setTime(d.getTime()+(7*24*60*60*1000))
  return 'expires='+d.toUTCString()
}

function log_in(){
  var main_window=document.getElementById("main_window")
  var str='<input id="username" type="text"><input id="passwd" type="password"><button id="sure">確定</button>'
  main_window.innerHTML=str
  document.getElementById("sure").onclick=function(){
    ID=document.getElementById("username").value
    var passwd=document.getElementById("passwd").value
    expires=limit_time()
    log_in_server(ID,passwd,expires)
  }

}

function time_count(){
  var user_data=get_cookie("user_data")
  if (user_data==null){
    log_in()
    user_data=get_cookie("user_data")
  }
  var data=JSON.parse(user_data)
  console.log(data)
}

function list_of_reciprocal(){
  main_window.innerHTML="<input type='text' id='hour'></input><h3>小時</h3><input type='text' id='min'></input><h3>分鐘</h3><input type='text' id='sec'></input><h3>秒</h3><button id='start'>計時開始</button>"
  document.getElementById("start").addEventListener("click",function(){
    var hour=document.getElementById("hour").value
    var min=document.getElementById("min").value
    var sec=document.getElementById("sec").value
    main_window.innerHTML="<h3 id='time_clack'>"+"</h3><button id='stop'>計時暫停</button>"
    output(hour,min,sec)
    continue_count()
  })
}

function continue_count(){
  var n_count=document.getElementById('time_clack').innerHTML
  n_count=n_count.split(" ")
  if (n_count.length==6){var id=check_time(n_count[0],n_count[2],n_count[4]);var time=parseInt(n_count[0])*3600+parseInt(n_count[2])*60+parseInt(n_count[4])}
  if (n_count.length==4){var id=check_time("0",n_count[0],n_count[2]);var time=parseInt(n_count[0])*60+parseInt(n_count[2])}
  if (n_count.length==2){var id=check_time("0","0",n_count[0]);var time=parseInt(n_count[0])}
  main_window.innerHTML="<h3 id='time_clack'>"+"</h3><button id='stop'>計時暫停</button>"
  document.getElementById("stop").addEventListener("click",function(){
    for (var i=0;i<time;i++)clearTimeout(id-i)
    var n_count=document.getElementById('time_clack').innerHTML
    main_window.innerHTML="<h3 id='time_clack'>"+n_count+"</h3>"+"<button onclick='continue_count()'>繼續</button>"+"<button onclick='list_of_reciprocal()'>重製</button>"
  })
}

function check_time(hour,min,sec){
  hour=parseInt(hour)
  min=parseInt(min)
  sec=parseInt(sec)
  if (sec>60){
    min+=Math.floor(sec/60)
    sec=sec%60
  }
  if (min>60){
    hour+=Math.floor(min/60)
    min=min%60
  }
  var timer=hour*3600+min*60+sec
  var id
  for (var i=0;i<timer;i++){
    id=setTimeout(function(){
    if (hour<=0 && min<=0 && sec <=0)return 0
    sec--;
    if (sec<0){
      sec=59;
      min=min-1;
    }
    if (min<0){
      min=59;
      hour=hour-1;
    }
    output(hour,min,sec)
    },i*1000)
  }
  setTimeout(function(){console.log("endofcounting")},timer*1000)
  return id
}

function output(hour,min,sec){
  var time_clack=document.getElementById('time_clack')
  var str=""
  if (hour>0)str+=hour+" 小時 "
  if (min>0 || hour>0)str+=min+" 分鐘 "
  str+=sec+" 秒鐘"
  time_clack.innerHTML=str
}
    
