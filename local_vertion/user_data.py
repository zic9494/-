import json
with open("user_db.json",mode='r') as file:
    userdata=json.load(file)

def save_data(act,ID,what,data):
    return 0

def log_in(ID:str,passwd:str):
    with open("password.json",mode="r")as file:
        password=json.load(file)
    try:
        Y=password[ID]
        if (passwd != Y):
            return 0
        else:
            return userdata[ID]
    except KeyError:
        return 0

'''def enroll(ID:str,passwd:str):
    now_data={ID:{"school":"","time_count":{},"memorable":[]}}
    
    with open("password.json",mode="r") as file:
        password=json.load(file)
    password.update({ID:passwd})
    
    with open("password.json",mode="w") as n_file:
        json.dump(password,n_file,indent=1)
    
    ALL_data.update(now_data)
    with open("user_db.json",mode="w") as file:
        json.dump(ALL_data,file,indent=1)
    return True'''

if __name__=="__main__":
    tmp=save_data("del","SA","sec","[{'time':'20:34','event':'%20now%20year'}]%3D2023/1/1")
    print(tmp)