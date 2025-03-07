# Simulador de carteira financeira
Este projeto cria endpoints para uma API REST para backend que seja capaz de consultar dados sobre indices financeiros para montar uma carteira de ativos e calcular sua rentabilidade diária e total.


## Instalar e executar

Tenha os seguintes softwares instalados na sua distro:

- git 
- docker
- node (testado em v22.4.1)
- npm (testado em 10.8.1)

opcional para testes manuais: bruno - Open source API Client similar ao Postman: https://www.usebruno.com/downloads

- Clone o repositório:
`git clone git@github.com:felipecaetano0/backend-carteira-financeira.git`

### Instalação Manual
- Execute o script criado para facilitar a instalação e execução do servidor:
`npm run up`

Este comando irá executar um pequeno script para instalar pacotes, buildar o projeto, executar os testes e iniciar o servidor.
Caso queira executar este passo manualmente, execute os seguintes comandos:
```
npm install
npm run build 
npm run test 
node dist/src/index.js
```

### Instalação via Docker
```
docker build -t broker_report .
docker run -p 9999:9999 broker_report
```

Caso necessite de outra porta, é possivel configurá-la através de uma variável de ambiente com o nome PORT

## Estrutura do projeto
Este projeto está estruturado em uma arquitetura MVC, onde foram implementadas as camadas de Model e Controller para criar uma API REST disponibilizar os dados para a View.

Para uma primeira implementação, foi utilizado a leitura por arquivos pré carregados. Para uma implementação visando adquirir os dados de uma fonte em tempo real, como por exemplo uma API financeira (https://query1.finance.yahoo.com/v8/finance/chart/BNDX11.SA), seria necessário somente implementar um interface IDataFetcher pois já foi injetada uma dependência com este objetivo.

Esta API não necessita de banco de dados sumariamente pois não armazena dados, somente consulta e os processa. Entretanto caso haja necessidade, a estrutura está pronta do projeto está pronta para implementar o armazenamento pois as classes model estão separadas das classes de controller.

## Testes automatizados
Foram implementados testes automatizados para testar os endpoints da API.

Estes testes são mais básicos (smoke tests) e focam no fato da api estar funcionando e respondendo, indeterminadamente se a resposta está correta.

Para executar os testes, execute o comando:
`npm run test`

Os testes foram projetados pensando nos critérios de aceitação do desafio (escopo)

## Testes Manuais
Baixe o Bruno (API Client similar ao Postman) em: https://www.usebruno.com/downloads.
Vá em Collection -> Open Collection
caminhe para a pasta onde está o projeto e abra a pasta tests/TesteAPI 

Uma coleção de testes de endpoint irá aparecer.

Também é possível executar os testes de maneira manual pelo navegador, pois todos os parâmetros necessários são passados via URL pelo método GET. Por exemplo:

http://localhost:9999/indice/IBOV
http://localhost:9999/indice/IBOV?from=1701867600&to=1711112400
http://localhost:9999/indice/CDI
http://localhost:9999/indice/CDI?from=518400000000&to=577670400000
http://localhost:9999/carteira?tickers=IBOV,ALUG11,WRLD11&pesos=50,20,30
http://localhost:9999/carteira?tickers=IBOV,ALUG11,WRLD11&pesos=50,20,30&from=1701867600&to=1711112400&valorInicial=10000

### Prints dos testes manuais

![](./prints_dos_testes/Screenshot%20from%202025-03-07%2011-54-02.png)
![](./prints_dos_testes/Screenshot%20from%202025-03-07%2011-54-16.png)
![](./prints_dos_testes/Screenshot%20from%202025-03-07%2011-54-27.png)
![](./prints_dos_testes/Screenshot%20from%202025-03-07%2011-55-11.png)
![](./prints_dos_testes/Screenshot%20from%202025-03-07%2011-55-19.png)
![](./prints_dos_testes/Screenshot%20from%202025-03-07%2011-55-33.png)
![](./prints_dos_testes/Screenshot%20from%202025-03-07%2011-56-31.png)
![](./prints_dos_testes/Screenshot%20from%202025-03-07%2011-56-54.png)

## Regras de negócio implementadas
![Arquitetura](./Diagrama%20de%20classe.jpg)


Este projeto foi criado para o desafio backend da Investo que pode ser acessado em: https://github.com/investo-etf/desafio-backend
