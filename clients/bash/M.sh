#!/bin/sh


#variable de controle
isFinish=false
name=""
context=""



#functions

help(){
    echo "************************************************\n";
    echo "************************************************\n";
    echo "How use: call the M and stay the path the latter\n";
    echo "    example: m up latters/interaction.js\n";
    echo "************************************************\n";
    echo "************************************************\n";
}

#conexão inicial para obter o modelo de contexto
connect(){
    context=$(curl GET http://localhost:3001/api/m | jq .)

    #welcome
    echo "Hi, the client commands of the M\n";

    echo $context
}

talking(){
    #perguntando ao usuario o que ele quer
    read -p "you: " name
    result=$(curl -d "$context" -X POST http://localhost:3001/api/m)
    echo "M: $result"
    
}

connect

while [ "$name" != "!exit" ]
do
    talking
done