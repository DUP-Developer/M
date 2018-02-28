#!/bin/sh

URL="http://localhost:3001/api/m"


json(){
    #fazendo a chamada no ao servidoe e esperando o json
    c=`curl $URL | jq .`
    
    #guardando num arquivo para poder analisar posteriormente
    echo $c > data.json
    
    #pegando o elemento que estiver no json
    json_return=`cat ~/Documents/dup/M/clients/bash/data.json | jq .$1 | sed -r 's/"+/ /g'`        
}

json "context"

echo $json_return
