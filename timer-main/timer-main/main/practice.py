from fastapi import FastAPI,Response,Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import function
import user_data
app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*']
)

templates=Jinja2Templates(directory='./HTML')
app.mount('/HTML',StaticFiles(directory='./HTML'),name='js')

@app.get("/action/school_data")
def find_calendar(schoolID:str,year:int,mon:int):
    url=function.get_url(schoolID,year,mon)
    data=function.get_data(url)
    return data

@app.get("/action/login")
def log_in(ID:str,passwd:str,response:Response):
    data=user_data.log_in(ID,passwd)
    max_age=604800
    response.set_cookie(key="user_data",value=data,max_age=max_age)
    return data

@app.get("/action/enrol")
def enrol(ID,passwd):
    user_data.enroll(ID,passwd)

@app.get("/action/return_data")
def save_data(ID,data):
    user_data.save_data(data,ID)

@app.get("/",response_class=HTMLResponse)
def home(request:Request):
    return templates.TemplateResponse('index.html',{'request':request})
