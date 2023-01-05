import json
import pyodbc
import time
from datetime import datetime
from yarl import URL
server = 'WIN-DFUK8N5E6L8' 
database = 'user_data' 
cnxn = pyodbc.connect(f"Driver=ODBC Driver 17 for SQL Server;Server={server};Database={database};Trusted_Connection=yes;UID=sa;PWD=ZhangYixun8964")
cnxn.setencoding(encoding="utf-8")
cursor = cnxn.cursor()
def add_sec(data,ID):
    detal=data.split("=")
    day=detal[1]
    detal=detal[0]
    detal=detal[1:-1:]
    now=""
    for i in detal:
        if i== '\'':
            now +="\""
        else:
            now+=i
    detal=json.loads(now)
    day = time.strptime(day, "%Y/%m/%d")
    d = datetime(day.tm_year,day.tm_mon,day.tm_mday)
    Time = time.strptime(detal['time'], "%H:%M")
    t =datetime(1900,1,1,Time.tm_hour,Time.tm_min)
    str=f"INSERT INTO sec(event, date, time, user_id) \nVALUES ('{detal['event']}','{d}','{t}','{ID}')"
    cursor.execute(str)
    cursor.commit()
    return 1

def del_sec(data,ID):
    tmp=data.split("=")
    detal=tmp[0]
    day=tmp[1]
    day = time.strptime(day, "%Y/%m/%d")
    detal=detal[1:-1:]
    now=""
    for i in detal:
        if i== '\'':
            now +="\""
        else:
            now+=i
    detal=json.loads(now)
    d = datetime(day.tm_year,day.tm_mon,day.tm_mday)
    Time = time.strptime(detal['time'], "%H:%M")
    t =datetime(1900,1,1,Time.tm_hour,Time.tm_min)
    str=f"DELETE FROM sec \nWHERE event='{detal['event']}' AND user_id='{ID}' AND date='{d}' AND time='{t}'"
    cursor.execute(str)
    cursor.commit()
    return 1
    
def add_memor(data,ID):
    str=f"INSERT INTO memorable(data, user_id) \nVALUES ('{data}','{ID}')"
    cursor.execute(str)
    cursor.commit()
    return 1

def del_memor(data,ID):
    str=f"DELETE FROM memorable \nWHERE user_id='{ID}' AND data='{data}'"
    cursor.execute(str)
    cursor.commit()

def enroll(data):
    try:
        data=data[:-1:]
        now=""
        for i in data:
            if i== '\'':
                now +="\""
            else:
                now+=i
        data=json.loads(now)
        school=data["school_id"]
        passwd=data["passwd"]
        ID=data["user_id"]
        str=f"INSERT INTO user_passwd(passwd, user_id) \nVALUES ('{passwd}','{ID}')"
        cursor.execute(str)
        cursor.commit()
        str=f"INSERT INTO school(school_id, user_id) \nVALUES ('{school}','{ID}')"
        cursor.execute(str)
        cursor.commit()
        return 1
    except:
        return 0

def save_data(act,ID,what,data):
    if what=='sec':
        if act=="add":
            return add_sec(data,ID)
        if act=="del":
            return del_sec(data,ID)
    if what=='memorable':
        if act=="add":
            return add_memor(data,ID)
        if act=="del":
            return del_memor(data,ID)
    if what =="enroll":
        return enroll(data)
        
def log_in(ID:str,passwd:str):
    try:
        cursor.execute(f"SELECT * FROM user_passwd \n where user_id ='{ID}'")
        for row in cursor:
            password=row[1]
        
        if passwd !=password:
            cursor.close()
            return 0
        else:
            cursor.execute(f"SELECT * FROM sec \n where user_id ='{ID}'")
            index=0
            all=[]
            event=[]
            for row in cursor:
                now =""
                time=""
                x=0
                now+=str(row[1].year)+"/"
                now+=str(row[1].month)+"/"
                now+=str(row[1].day)
                for i in range(index):
                    if all[i]==now:
                        x=i
                if now not in all :
                    all.append(now)
                    i=-1
                    index+=1
                time+=str(row[2].hour)+":"
                time+=str(row[2].minute)
                data={"time":time,"event":row[0]}
                if i==-1:
                    event.append([data])
                else:
                    event[i].append(data)
            cursor.execute(f"SELECT * FROM school \n where user_id ='{ID}'")
            for row in cursor:
                school=row[0]
            cursor.execute(f"SELECT * FROM memorable \n where user_id ='{ID}'")
            memorable=[]
            for row in cursor:
                memorable.append(row[0])
            user_data={"school":school,"ALL_sce":event,"Event_day":all,"memorable":memorable}
            return user_data
    except:
        return 0


if __name__=="__main__":
    tmp=save_data("del","SA","sec","[{'time':'20:34','event':'%20now%20year'}]%3D2023/1/1")
    print(tmp)