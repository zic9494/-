from fastapi import FastAPI,Response,Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import school_data
import user_data
from pydantic import BaseModel

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*']
)

templates=Jinja2Templates(directory='./HTML')
app.mount('/HTML',StaticFiles(directory='./HTML'),name='js')

class log_in(BaseModel):
   ID:str
   passwd:str

class change_data(BaseModel):
    act:str
    ID:str
    data:str
    what:str

class new_user(BaseModel):
    ID:str
    passwd:str
    school:str

@app.post("/action/login")
def log_in(data:log_in):
    data=user_data.log_in(data.ID,data.passwd)
    return data

@app.post("/action/enrol")
def enrol(data:new_user):
    user_data.enroll(data.ID,data.passwd,data.school)

@app.post("/action/return_data")
def save_data(data:change_data):
    return user_data.save_data(data.act,data.ID,data.what,data.data)

@app.get("/",response_class=HTMLResponse)
def home(request:Request):
    return templates.TemplateResponse('test.html',{'request':request})

@app.get("/action/school_data")
def find_calendar(schoolID:str,year:int,mon:int):
    data=school_data.get_data(schoolID,year,mon)
    return data