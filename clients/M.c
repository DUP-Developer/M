#include <stdio.h>


void help()
{
    printf("Hi, the client commands of the M\n\n");

    printf("************************************************\n");
    printf("************************************************\n");
    printf("How use: call the M and stay the path the latter\n");
    printf("example: m up latters/interaction.js\n");
    printf("************************************************\n");
    printf("************************************************\n");
}


/**
função resposavel por subir o arquivo
**/
void uploadLatters()
{

}

int main(int argc, char const *argv[]) {

    printf("%s\n", argv[1]);

    if(argv[1] == "up"){
        uploadLatters();
    }else{
        help();
    }

    return 0;
}
