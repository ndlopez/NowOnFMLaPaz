#!/usr/bin/python3.9
import sys,json
sourceFile=sys.argv[1]
with open(sourceFile,'r') as myFile:
    data=myFile.read()
myFile.close()

info_data=json.loads(data)
dat=[]
for item in info_data['data']:
    dat.append(item)

print(dat[0]['listeners'],",",dat[0]['song'])
