import json
function=["time_count","memorable"]
with open("user_db.json",mode="r") as sfile:
    ALL_data=json.load(sfile)

def save_data(now_data:dict,ID:str):
    ALL_data[ID]=now_data
    with open("user_db.json",mode="w") as file:
        json.dump(ALL_data,file,indent=1)

def log_in(ID:str,passwd:str):
    try:
        data=ALL_data[ID]
        with open("password.json",mode="r") as file:
            password=json.load(file)
        PW_data=password[ID]
    except KeyError:
        return 0
    if PW_data==passwd:
        return data

def enroll(ID:str,passwd:str):
    now_data={ID:{"school":"","time_count":{},"memoradle":{}}}
    
    with open("password.json",mode="r") as file:
        password=json.load(file)
    password.update({ID:passwd})
    
    with open("password.json",mode="w") as n_file:
        json.dump(password,n_file,indent=1)
    
    ALL_data.update(now_data)
    with open("user_db.json",mode="w") as file:
        json.dump(ALL_data,file,indent=1)
    return True

if __name__=="__main__":
    #data=enroll("shark","A")
    print("data")