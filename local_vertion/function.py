import json
import urllib.request as req
with open("url_db.json",mode="r") as file:
    school_url=json.load(file)
def get_url(schoolID,year,mon):
    if mon+1>12:
        year+=1
        min_mon="01"
    elif mon-1<1:
        year-=1
        max_mon="12"
    else:
        min_mon=mon-1
        max_mon=mon+1
        if min_mon<10:
            min_mon=f"0{min_mon}"
        else:
            min_mon=f"{min_mon}"
        if max_mon<10:
            max_mon=f"0{max_mon}"
        else:
            max_mon=f"{max_mon}"
    school_data=school_url[schoolID]
    web_side=school_url["url"]+school_data["S_url"]+school_url["medel1"]+school_data["calendarId"]+school_url["befor_time"]+f"{year}-{min_mon}-30"+school_url["between_time"]+f"{year}-{max_mon}-01"+school_url["the_end"]
    return web_side

def get_data(url):
    with req.urlopen(url) as data:
        json_data=json.loads(data.read())
    return json_data

if __name__=="__main__":
    Url=get_url("tcivs",2022,10)
    data=get_data(Url)
    print(type(data))