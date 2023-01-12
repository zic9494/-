import requests
from yarl import URL
import json
import pyodbc

server = 'WIN-DFUK8N5E6L8' 
database = 'user_data' 
cnxn = pyodbc.connect(f"Driver=ODBC Driver 17 for SQL Server;Server={server};Database={database};Trusted_Connection=yes;UID=sa;PWD=ZhangYixun8964")
cnxn.setencoding(encoding="utf-8")
cursor = cnxn.cursor()

def data_id(school_id):
    Str=f"SELECT * FROM calender_id \n where school_id ='{school_id}'"
    cursor.execute(Str)
    for row in cursor:
        ID=row[1]
    return ID

def make_url(ID,year,month):
    data=data_id(ID)
    if month==1:
        defor='12'
        month='02'
        b_year=year-1
    elif month<10:
        defor='0'+str(month-1)
        month='0'+str(month+1)
        b_year=year
    else:
        defor=str(month-1)
        month=str(month+1)
        b_year=year
    timeMax=f"{year}-{month}-05T00:00:00+08:00"
    timeMin=f'{b_year}-{defor}-28T00:00:00+08:00'
    Query={"calendarId":data,'singleEvents': 'true', 'timeZone': 'Asia/Taipei', 'maxAttendees': '1', 'maxResults': '250', 'sanitizeHtml': 'true',"timeMin":timeMin,"timeMax":timeMax,'key': 'AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs'}
    url=URL("https://clients6.google.com")
    Path=f"/calendar/v3/calendars/{data}/events"
    url=url.with_path(Path).with_query(Query)
    return url

def get_data(ID,year,month):
    Url=make_url(ID,year,month)
    r=requests.get(Url)
    data=json.loads(r.text)
    Request={"items":[]}
    for i in range(len(data["items"])):
        Dict={"summary":data["items"][i]["summary"],"start_time":data["items"][i]["start"],"end_time":data["items"][i]["end"]}
        Request["items"].append(Dict)
    return Request

if (__name__=="__main__"):
    print(get_data("tcivs",2023,1))
    