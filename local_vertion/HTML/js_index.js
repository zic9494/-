var month_day=[31,28,31,30,31,30,31,31,30,31,30,31]
var chine_day=["日","一","二","三","四","五","六"]
var n_year
var n_month
var n_day
var month_data
var main_window=document.getElementById("main_window")
function get_school_data()/*取得學校行事曆*/{
  var User_data=get_cookie("user_data")
  User_data=JSON.parse(User_data)
  var dataUrl= "https://92b8-210-70-74-168.jp.ngrok.io/action/school_data?schoolID="+User_data.school+"&year="+n_year+"&mon="+(n_month+1)
  console.log(dataUrl)
  var xhr=new XMLHttpRequest()
  xhr.open('GET',dataUrl,true)
  setTimeout(xhr.send(),0)
  xhr.onload=function(){
    var data=xhr.responseText
    write_cookie("school_data",data,limit_time())
    var tmp=get_cookie("user_id")
  }
}

function today()/*獲取今天日期和呼叫行事曆*/{
  date=Date.now()
  const dateObj = new Date(date)
  n_year=dateObj.getFullYear()
  n_month=dateObj.getMonth()
  n_day=dateObj.getDate()
  get_school_data()
  get_now_data()
  day_schedule(n_day)
}

function get_firstday(year,month)/*獲得該月的第一天為星期幾*/{
  var d=new Date();
  d.setDate(1)
  d.setFullYear(year)
  d.setMonth(month)
  return d.getDay()
}

function get_now_data()/*列印出行事曆日期*/{
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
  var caleder='<div class=calendar_title><h1>'+n_year+"年"+(n_month+1)+"月"+'</h1>'+'<button onclick="month_move(-1)"><</button><button onclick="month_move(1)">></button><button onclick="today()">今天</button></div>'+'<table class=".calendar">'
  caleder=caleder+"<tr>"
  for (var i=0;i<7;i++){caleder=caleder+'<td >'+chine_day[i]+"</td>"}
  caleder=caleder+"</tr>"
  var line=5
  if ((first_day==5 && days==31) || first_day==6)line=6
  for (var i=0;i<line;i++){
    caleder=caleder+'<tr>'
    for (var x=0;x<7;x++){
      if (i*7+x<first_day || i*7+x-first_day>=days){
        caleder=caleder+"<td>&nbsp;</td>"
      }else{
        var day=i*7+x-first_day+1
        caleder=caleder+"<td class=every_day onclick=day_schedule("+day+")>"+day+"</td>"
      }
    }
    caleder=caleder+"</tr>"
  }
  caleder=caleder+"</table><div id='day_schedule'></div><div id='school_event'></div>"
  main.innerHTML=caleder
}

function day_schedule(c_day)/*獲取被點擊當天的所有行程，並產生 to_do list*/{
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
  str=str+"<li id='add_list'><button onclick='add_event("+c_day+")'>+</button></li></ul>"
  detal.innerHTML=str
  school_event(c_day)
}

function school_event(c_day){
  var data=get_cookie("user_data")
  data=JSON.parse(data)
  if (data.school=='0')return 0
  data=get_cookie("school_data")
  data=JSON.parse(JSON.parse(data))
  var show=[]
  var list=document.getElementById("school_event")
  var event=data.items
  for(var x=0;x<event.length;x++){
    var tmp=event[x]
    var start=tmp.start_time.date
    start=start.split("-")
    for (var i=0;i<3;i++)start[i]=parseInt(start[i])
    var end=tmp.end_time.date
    end=end.split("-")
    for (var i=0;i<3;i++)end[i]=parseInt(end[i])
    if (n_year<start[0])tmp=0
    else if (n_month+1<start[1])tmp=0
    else if (c_day<start[2])tmp=0

    if (n_year>end[0])tmp=0
    else if (n_month+1>end[0])tmp=0
    else if (c_day>end[2])tmp=0
    if (tmp==0)continue
    else show.push(event[x])
  }
  Str="<h3>school event</h3><ul>"
  for (var i=0;i<show.length;i++){
    Str+="<li>"+show[i].summary+"</li>"
  }
  Str+="</ul>"
  if (show.length!=0)list.innerHTML=Str
  else list.innerHTML=""
}

function add_event(day)/*新增被點擊那天的行程*/{
  var input=document.getElementById("add_list")
  input.innerHTML="<input type='time' id='tim'><input type='text' id='inp'><button id='sure' onclick='write_event("+day+")'>確定</button>"
  inp.addEventListener("keypress",function(event){
    if (event.key=="Enter"){
      event.preventDefault()
      write_event(day)
    }
  })
}

function write_event(c_day)/*將形成寫入cookie*/{
  var data=get_cookie("user_data")
  data=JSON.parse(data)
  var day=n_year+'/'+(n_month+1)+'/'+c_day
  var i=-1
  var index
  var data_list=data.Event_day
  for (index=0;index<data_list.length;index++)if (data_list[index]==day){i=index;break}
  if (i!=-1){
    var inp=document.getElementById("inp").value
    var tim=document.getElementById("tim").value
    var chang=data.ALL_sce[index]
    var tmp={"time":tim,"event":inp}
    chang.push(tmp)
    data.ALL_sce[index]=chang
  }else{
    data_list.push(day)
    var inp=document.getElementById("inp").value
    var tim=document.getElementById("tim").value
    var chang=data.ALL_sce
    var tmp=[{"time":tim,"event":inp}]
    var i=data_list.length
    chang.push(tmp)
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
  var json=JSON.stringify(tmp).replace(/"/g,"'")
  json=json.replace(/ /g,"%20")
  var tmp=json+'='+day
  console.log(tmp)
  write_cookie("user_data",data,limit)
  save_data("sec","add",tmp)
  get_now_data()
  day_schedule(c_day)
}

function del_event(c_day,index)/*將被刪除的行程從cookie移除*/{
  var data=get_cookie("user_data")
  data=JSON.parse(data)
  var s_day=n_year+"/"+(n_month+1)+"/"+c_day
  var day=data.Event_day
  var i=-1
  for (var x=0;x<day.length;x++)if(day[x]==s_day){i=x;break};
  var e_data=data.ALL_sce
  var be_del=JSON.stringify(e_data[index])
  console.log(be_del)
  if (index==0 && e_data[i].length==1){
    var tmp=[]
    if (i>0)tmp=e_data.slice(0,i)
    tmp=tmp.concat(e_data.slice(i+1,e_data.length))
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
  save_data("sec","del",be_del+"="+s_day)
}

function month_move(move)/*行事曆的月份移動*/{
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

function get_cookie(kind)/*讀取cookie*/{
  let decodeCookie=decodeURIComponent(document.cookie)
  let piece=decodeCookie.split(";")
  for (var i=0;i<piece.length;i++){
    var data=piece[i].split("=")
    while (data[0].charAt(0)==' ')data[0]=data[0].substring(1)  
    if (data[0]==kind)return data[1]
  }
  return 0
}

function write_cookie(name,data,time_limit)/*撰寫或修改cookie*/{
  data=JSON.stringify(data)
  document.cookie=name+"="+data+";"+time_limit
}

function save_data(what,act,data)/*將有改變的資料回傳至web server*/{
  id=get_cookie("user_id")
  data_Url="https://92b8-210-70-74-168.jp.ngrok.io/action/return_data"
  var xhr=new XMLHttpRequest()
  xhr.open('post',data_Url,true)
  xhr.setRequestHeader('Content-Type','application/json');
  var req=JSON.stringify({"act":act,"ID":id,"data":data,"what":what})
  console.log(req)
  xhr.send(req)
}

function log_in_server(ID,passwd,time_limit)/*向web server提出登入請求，並回傳使用者資料*/{
  data_Url="https://92b8-210-70-74-168.jp.ngrok.io/action/login"
  var xhr=new XMLHttpRequest()
  xhr.open('post',data_Url,true)
  xhr.setRequestHeader('Content-Type','application/json');
  var req=JSON.stringify({"ID":ID,"passwd":passwd})
  xhr.send(req)
  xhr.onload=function(){
    var tmp=xhr.responseText
    tmp=tmp.replace(/@@/g," ")
    document.cookie = 'user_id='+ID+";"+time_limit
    document.cookie="user_data="+tmp+";"+time_limit
    if (tmp==0)main_window.innerHTML="<h3>log in fail</h3>"
    else main_window.innerHTML="<h3>log in success</h3>"
  }
  
}

function log_in()/*獲取使用者輸入的資料*/{
  var main_window=document.getElementById("main_window")
  var str='<h3>帳號</h3><input id="username" type="text"><h3>密碼</h3><input id="passwd" type="password"><button id="sure">確定</button><a href="javascript:enroll()">沒有帳號嗎?</a>'
  main_window.innerHTML=str
  document.getElementById("sure").onclick=function(){
    ID=document.getElementById("username").value
    var passwd=document.getElementById("passwd").value
    log_in_server(ID,passwd,limit_time())
  }
}

function limit_time()/*設定cookie的到期時間*/{
  const d=new Date()
  d.setTime(d.getTime()+(7*24*60*60*1000))
  return 'expires='+d.toUTCString()
}

function enroll()/*呼叫註冊頁面*/{
  main_window.innerHTML='<h3>使用者帳號(50字元以下)</h3><input id="e_username" type="text"><h3>密碼(50字元以下)</h3><input id="password" type="password"><h3>學校代碼(小寫)</h3><input id="school" type="text"><button onclick="inp_sure()">確定</button>'
}

function inp_sure()/*獲取註冊資料*/{
  var ID=document.getElementById("e_username").value
  var passwd=document.getElementById("password").value
  var school=document.getElementById("school").value
  if (school==null)school=0
  var data={"ID":ID,'passwd':passwd,'school':school}
  data=JSON.stringify(data)
  data_Url="https://92b8-210-70-74-168.jp.ngrok.io/action/enrol"
  var xhr=new XMLHttpRequest()
  xhr.open('post',data_Url,true)
  xhr.setRequestHeader('Content-Type','application/json');
  xhr.send(data)
  write_cookie('user_id',ID ,limit_time())
  log_in()
}

function list_of_reciprocal()/*獲取倒數計時時間*/{
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

function continue_count()/*繼續計時*/{
  var n_count=document.getElementById('time_clack').innerHTML
  n_count=n_count.split(" ")
  if (n_count.length==6){var id=check_time(n_count[0],n_count[2],n_count[4]);var time=parseInt(n_count[0])*3600+parseInt(n_count[2])*60+parseInt(n_count[4])}
  if (n_count.length==4){var id=check_time("0",n_count[0],n_count[2]);var time=parseInt(n_count[0])*60+parseInt(n_count[2])}
  if (n_count.length==2){var id=check_time("0","0",n_count[0]);var time=parseInt(n_count[0])}
  main_window.innerHTML="<h3 id='time_clack'>"+"</h3><button id='stop'>計時暫停</button>"
  document.getElementById("stop").addEventListener("click",function(){
    for (var i=0;i<time;i++)clearTimeout(id-i)
    var n_count=document.getElementById('time_clack').innerHTML
    main_window.innerHTML="<h3 id='time_clack'>"+n_count+"</h3>"+"<button onclick='continue_count()'>繼續</button>"+"<button onclick='list_of_reciprocal()'>重置</button>"
  })
}

function check_time(hour,min,sec)/*設定時間，且確保時間不為負數*/{
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

function output(hour,min,sec)/*更新剩餘時間*/{
  var time_clack=document.getElementById('time_clack')
  var str=""
  if (hour>0)str+=hour+" 小時 "
  if (min>0 || hour>0)str+=min+" 分鐘 "
  str+=sec+" 秒鐘"
  time_clack.innerHTML=str
}

function memorable()/*呼叫備忘錄*/{
  data=get_cookie("user_data")
  var data=JSON.parse(data)
  var list=data.memorable
  var str=""
  for (var i=0;i<list.length;i++){
    str=str+"<li><button onclick='del_memorable("+i+")'>-</button>"+list[i]+"</li>"
  }
  str+="<li id='add'><button onclick='add_memor()'>+</button></li>"
  main_window.innerHTML=str
}

function del_memorable(index)/*刪除備忘錄*/{
  var data=get_cookie("user_data")
  data=JSON.parse(data)
  var tmp=data.memorable
  var be_del=tmp[index]
  data.memorable=tmp.slice(0,index)
  tmp=tmp.slice(index+1,index.length)
  for (var i=0;i<tmp.length;i++)data.memorable.push(tmp[i])
  var limit=limit_time()
  write_cookie("user_data",data,limit)
  save_data('memorable','del',be_del)
  memorable()
}

function add_memor()/*呼叫備忘錄新增備忘錄的頁面*/{
  str="<input type='text' id='inp'><button onclick='add_memorable()'>確定</button>"
  var list=document.getElementById("add")
  list.innerHTML=str
}

function add_memorable()/*新增備忘錄*/{
  var data=get_cookie("user_data")
  var inp=document.getElementById('inp').value
  var list=document.getElementById("add")
  data=JSON.parse(data)
  data.memorable.push(inp)
  var limit=limit_time()
  write_cookie("user_data",data,limit)
  save_data('memorable','add',inp)
  memorable()
}
