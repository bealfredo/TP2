# TP2

## Todo

- 16/02: Tema + Dupla + Requisitos Funcionais

- 26/02: Protótipo das telas

- 01/03: Diagrama de classes

## 02.04.2024

### Livros

- codigo limpo
- arquitetura limpa
- microserviços prontos para a produção

### tecnologias

- analista de sistemas, não programador
- arquiteto de software, conhece de tudo, define padrões
- gerente de projetos, alem de coordenar, trabalha com pessoas


### projeto final

- difinição do tema e requisitos funcionais
- definição das telas do sistema
- diagrama de classes

### instalar recursos

- Node 20 lts
    - (v20 lts só pra versão 17 do angular)
    - para executar o cli do angular
    - https://nodejs.org/en/download/

- angular cli
    - npm install -g @angular/cli
    - npm unistall -g @angular/cli
    - v 17
    - ng version

### Notes 

- pode desinstalar o programa que gera as chaver, vai usar as que já foram geradas

### criar pasta
- modelo stand alone - padrão a partir da 17

- pasta angular
- ng new hello-world
- css(enter)
- enter

### comandos

- ctrl + j
    - abrir terminal

- ng serve
    - executar

- [http://localhost:4200/](http://localhost:4200/)

### componentes trabalhados

- https://material.angular.io/
- instalando
    - ng add @angular/material


## 09.02.2024

### Requisitos funcionais e não funcionais
> https://visuresolutions.com/pt/blog/requisitos-n%C3%A3o-Funcionais/

> https://codificar.com.br/requisitos-funcionais-nao-funcionais/

- funcionais: ações que o usuario detecta, visualmente

- não funcionais: por trás, ex: angular, quarkus

- ex:
    - Gerenciar um funcionário no sistema
    - Incluir/Excluir/Alterar nome em uma tela de manutenção de
    - Permitir login através de conta de funcionário e usuário
    - Permitir login com cpf e email


### Repositório professor:

> https://github.com/janiojunior/psicologia

> diagrama: angular\psicologia\src\main\resources\documents\Diagrama_Sistema_Agendamento_Psicologia.plantuml

- obs:
    - não pensar na classe, mas no conteúdo
    - o endereço é uma composição, só vai existir com o paciente, e vai ter repetidos, pois é exclusivo
    - cidade dentro de paciente significa naturalidade

- notes:
    - impostos estatuais na tabela de estado, data de cadastro?
    - o professor que o diagrama dos dados, modelo de dados
        - o que estão na classe pasta model
    - dto
        - informações que quero do usuario, e as que quero devolver
    - repository

### Executando projeto

> ./mvnw compile quarkus:dev

login group roles
create
login
topicos2
12345
todos os privilégios

database
createdb
topicos2db
owner topicos2
postgrees, pd_Default, pt_br

### Angular
- plataforma e framework para contruir aplicações web

### Criar componente

- ng g c components/estado-list --skip-tests
    - g: generate
    - c: component

### Criar class

- ng g class models/estado --type=model --skip-tests

```
export class Estado {
    id!: number;
    nome!: string;
    sigla!: string;
}
```

### Criar service

- ng g service services/estado --skip-tests

### interpolation angular
- ligação entre html e typescript

### configurar cores na api
- liberar para outros servidores acessare,
- src/main/resource/application.properties