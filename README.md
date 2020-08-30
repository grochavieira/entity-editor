<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/grochavieira/EntityEditor?color=%2304D361&style=for-the-badge">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/grochavieira/EntityEditor?style=for-the-badge">
  
  <a href="https://github.com/grochavieira/EntityEditor/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/grochavieira/EntityEditor?style=for-the-badge">
  </a>
    
   <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen?style=for-the-badge">

  <a href="https://github.com/grochavieira">
    <img alt="Feito por Guilherme Rocha Vieira" src="https://img.shields.io/badge/feito%20por-grochavieira-%237519C1?style=for-the-badge&logo=github">
  </a>
  
 
</p>
<h1 align="center">
    <img src="assets/logo.png">
</h1>

<h4 align="center"> 
	🚧  Site Concluído 🚧
</h4>

## 🏁 Tópicos

<p>
 👉<a href="#-sobre-o-projeto" style="text-decoration: none; "> Sobre</a> <br/>
👉<a href="#-funcionalidades" style="text-decoration: none; "> Funcionalidades</a> <br/>
👉<a href="#-layout" style="text-decoration: none"> Layout</a> <br/>
👉<a href="#-como-executar-o-projeto" style="text-decoration: none"> Como executar</a> <br/>
👉<a href="#-tecnologias" style="text-decoration: none"> Tecnologias</a> <br/>
👉<a href="#-autor" style="text-decoration: none"> Autor</a> <br/>
👉<a href="#user-content--licença" style="text-decoration: none"> Licença</a>

</p>

## 💻 Sobre o projeto

<p align="justify">
Recebemos a proposta de desenvolver um site para a criação e edição de entidades virtuais, nomeado \textit{Entity Editor}, que será utilizado pelos integrantes do SWAMP (projeto de irrigação inteligente para diminuir o consumo de água na agricultura), pois eles precisam virtualizar as fazendas, assim como os equipamentos e conceitos subjetivos que fazem parte delas, para que essas entidades possam ser armazenadas dentro de um banco de dados e, posteriormente, possam ser manipuladas pelas aplicações que eles desenvolveram.
</p>

<p align="justify">
    Atualmente, os nossos clientes utilizam o \textit{Postman}, que é uma ferramenta bastante utilizada para testar APIs WEB com o envio de requisições HTTP, para a criação de entidades, no entanto, existe uma grande dificuldade durante esse processo de gerar uma nova entidade, pois eles precisam escrever todas as características da entidade seguindo um determinado padrão estabelecido no SWAMP, além de precisar redigir todo o texto no formato \textit{JSON}(Notação de Objetos em Javascript ou \textit{Javascript Object Notation}, em inglês), se tornando uma atividade bastante maçante, principalmente na criação de múltiplas entidades, ou então no relacionamento entre elas, que é um dos conceitos mais importantes nesse exercício de virtualização.
</p>

<p align="justify">
    Portanto, nosso trabalho é desenvolver uma aplicação que seja capaz de fornecer as mesmas ferramentas que o \textit{Postman}, porém de uma forma simplificada e amigável ao usuário, que automaticamente implemente os padrões utilizados no projeto SWAMP, além de facilitar o processo de edição, criação ou exclusão das entidades, e, principalmente, prover um fácil relacionamento entre elas, seguindo as regras estabelecidas pelos clientes.
</p>
---

<a name="-funcionalidades"></a>

## ⚙️ Funcionalidades

- [x] Página Home com um breve resumo da utilização de cada página.

- [x] Entidades podem ser criadas:

  - [x] Com os tipos disponíveis (SoilProbe, ManagementZone, Farm e Farmer);
  - [x] Adicionando novos atributos, sem serem repetidos, dos tipos Text e Number;
  - [x] Adicionando novos relacionamentos (se estiverem disponíveis);
  - [x] Sem a adição das opções anteriores.

- [x] Entidades podem ser listadas:

  - [x] Por meio de uma pesquisa por ID;
  - [x] Por meio de uma pesquisa por Tipo;
  - [x] Totalmente.

- [x] Entidades podem ser deletadas.

- [x] Entidades podem ser atualizadas:

  - [x] Adicionando Atributos;
  - [x] Deletando Atributos;
  - [x] Adicionando Relacionamentos;
  - [x] Deletando Relacionamentos.

- [x] Pagína About com mais informações sobre os desenvolvedores.

---

## 🎨 Layout

### Página Home:

<p align="center">
    <img src="assets/home_page_demonstration.gif">
</p>

### Página Create (Entities):

<p align="center">
    <img src="assets/create_page_demonstration.gif">
</p>

### Demonstração de Relacionamento entre Entidades:

<p align="center">
    <img src="assets/relationship_demonstration.gif">
</p>

### Demonstração de Paginação:

<p align="center">
    <img src="assets/pagination_demonstration.gif">
</p>

### Demonstração de Pesquisa por ID e Tipo da Entidade:

<p align="center">
    <img src="assets/search_demonstration.gif">
</p>

### Demonstração de Atualização de Entidades:

<p align="center">
    <img src="assets/update_demonstration.gif">
</p>

### Demonstração de Exclusão de Entidades:

<p align="center">
    <img src="assets/delete_demonstration.gif">
</p>

### Página About:

<p align="center">
    <img src="assets/about_page_demonstration.gif">
</p>

---

## 🚀 Como executar o projeto

Este projeto é divido em duas partes:

1. Backend (pasta docker)
2. Frontend (pasta web)

💡O Frontend precisa que o Backend esteja sendo executado para funcionar.

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/), [Yarn](https://classic.yarnpkg.com/en/docs/install) e [Docker](https://www.docker.com/).
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

#### 🎲 Rodando o Backend (servidor)

```bash

# Clone este repositório
$ git clone https://github.com/grochavieira/EntityEditor.git

# Acesse a pasta do projeto no terminal/cmd
$ cd EntityEditor

# Vá para a pasta docker
$ cd docker

# Execute a docker (lembrando que o docker precisa ser inicializado primeiro)
$ docker-compose -f docker-compose-dev.yml up -d

# O docker utilizara a porta 1026 - acesse http://localhost:1026/v2/entities

```

#### 🧭 Rodando a aplicação web (Frontend)

```bash

# Clone este repositório
$ git clone https://github.com/grochavieira/EntityEditor.git

# Acesse a pasta do projeto no seu terminal/cmd
$ cd EntityEditor

# Vá para a pasta da aplicação Front End
$ cd web

# Instale as dependências
$ yarn install

# Execute a aplicação em modo de desenvolvimento
$ yarn start

# A aplicação será aberta na porta:3000 - acesse http://localhost:3000

```

---

## 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

#### **Website** ([React](https://reactjs.org/))

- **[React Router Dom](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom)**
- **[React Icons](https://react-icons.github.io/react-icons/)**
- **[Axios](https://github.com/axios/axios)**
- **[Unform](https://github.com/Rocketseat/unform)**
- **[React Select](https://react-select.com/home)**

> Veja o arquivo [package.json](https://github.com/grochavieira/EntityEditor/blob/master/web/package.json)

#### **Utilitários**

- Editor: **[Visual Studio Code](https://code.visualstudio.com/)**
- Teste de API: **[Insomnia](https://insomnia.rest/)**
- Ícones: **[Feather Icons](https://feathericons.com/)**
- Fontes: **[Roboto](https://fonts.google.com/specimen/Roboto)**, **[Kaushan Script](https://fonts.google.com/specimen/Kaushan+Script)**

---

<a name="-autor"></a>

## 🦸‍♂️ **Autor**

<p>
<kbd>
 <img src="https://avatars1.githubusercontent.com/u/48029638?s=460&u=f8d11a7aa9ce76a782ef140a075c5c81be878f00&v=4" width="150px;" alt=""/>
 </kbd>
 <br />
 <sub><strong>🌟 Guilherme Rocha Vieira 🌟</strong></sub>
</p>

[![Linkedin Badge](https://img.shields.io/badge/-Guilherme-blue?style=for-the-badge&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/grochavieira/)](https://www.linkedin.com/in/grochavieira/)
[![Gmail Badge](https://img.shields.io/badge/-guirocha.hopeisaba@gmail.com-c14438?style=for-the-badge&logo=Gmail&logoColor=white&link=mailto:guirocha.hopeisaba@gmail.com)](mailto:guirocha.hopeisaba@gmail.com)

---

## 📝 Licença

Este projeto esta sobe a licença [MIT](./LICENSE).

Feito com :satisfied: por Guilherme Rocha Vieira 👋🏽 [Entre em contato!](https://www.linkedin.com/in/grochavieira/)

---
