# AutoGrid WebSite
## 📖 Sobre o Projeto
O AutoGrid WebSite é uma aplicação web moderna e responsiva para a exibição e gerenciamento de catálogos de veículos. Desenvolvido com Spring Boot, o projeto oferece uma interface de usuário dinâmica com atualizações em tempo real, um painel de administração seguro e completo, e uma arquitetura robusta para garantir performance e escalabilidade.

## ✨ Funcionalidades Principais
* **Vitrine de Veículos:** Página inicial que exibe os veículos disponíveis e recebe notificações instantâneas sobre novos anúncios.
* **Busca Avançada:** Uma página de busca com múltiplos filtros (marca, modelo, ano, etc.) para que os usuários encontrem facilmente o veículo desejado.
* **Painel de Administração Seguro:** Área restrita protegida com Spring Security, permitindo o gerenciamento completo do catálogo.
* **Gerenciamento de Veículos (CRUD)**
  * **Criação:** Formulário intuitivo para adicionar novos veículos.
  * **Edição:** Atualização de informações de veículos existentes.
  * **Exclusão:** Remoção de veículos do catálogo.
  * **Integração com API do IBGE:** Durante o cadastro, a localização do veículo é selecionada a partir de dados oficiais do IBGE, garantindo precisão e confiabilidade das informações.
  * **Notificações em Tempo Real:** Ao cadastrar um novo veículo, uma mensagem é enviada via WebSocket (utilizando Apache Kafka como mensageria) para a página inicial, atualizando todos os usuários conectados em tempo real.

## 🚀 Tecnologias Utilizadas
O projeto foi construído utilizando um conjunto de tecnologias modernas e eficientes:

* Backend
  * Java 17, Spring Boot 3, Spring Security, Spring Data JPA, WebSocket, Apache Kafka
* Banco de Dados
  * H2 Database (para ambiente de desenvolvimento)
* Frontend
  * Thymeleaf, HTML5, CSS3, JavaScript
* DevOps
  * Docker & Docker Compose
* Build
  * Apacha Gradle

## ⚙️ Como Executar o Projeto Localmente
Siga os passos abaixo para configurar e executar a aplicação em seu ambiente de desenvolvimento.

### Pré-requisitos
* Java JDK 17 ou superior
* Apache Maven 3.8 ou superior
* Docker
* Docker Compose

### Passos
1. Clone o repositório:

  ```bash
  git clone https://github.com/agsjohn/AutoGrid_WebSite.git
  cd AutoGrid_WebSite
  ```

2. Execute a aplicação com o Maven Wrapper:

  ```bash
  gradlew run
  ```
  A aplicação estará disponível em http://localhost:8080.

3. 🐳 Executando com Docker: 
  Navegue até a raiz do projeto. 
  Construa as imagens e inicie os contêineres: 

  ```bash
  docker-compose up --build
  ```

  Este comando irá baixar as dependências, construir a imagem da aplicação e iniciar todos os serviços necessários (incluindo Kafka e Zookeeper).

* Acesse a aplicação: 

Página Inicial: http://localhost:8080
Painel de Login: http://localhost:8080/login

# 👨‍💻 Autor
João Vitor M. - agsjohn
