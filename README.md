# AutoGrid WebSite
O AutoGrid WebSite é uma aplicação web moderna e responsiva para a exibição e gerenciamento de catálogos de veículos. Desenvolvido com Spring Boot, o projeto oferece uma interface de usuário dinâmica com atualizações em tempo real, um painel de administração seguro e completo, e uma arquitetura robusta para garantir performance e escalabilidade.

## 📖 Sumário
* [✨ Funcionalidades Principais](https://github.com/agsjohn/AutoGrid_WebSite/edit/main/README.md#-funcionalidades-principais)
* [📸 Imagens do Projeto](https://github.com/agsjohn/AutoGrid_WebSite/edit/main/README.md#-funcionalidades-principais)
* [🔒 Acesso ao Painel de Administração](https://github.com/agsjohn/AutoGrid_WebSite/edit/main/README.md#-funcionalidades-principais)
* [🚀 Tecnologias Utilizadas](https://github.com/agsjohn/AutoGrid_WebSite/edit/main/README.md#-funcionalidades-principais)
* [⚙️ Como Executar o Projeto Localmente](https://github.com/agsjohn/AutoGrid_WebSite/edit/main/README.md#-funcionalidades-principais)

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

## 📸 Imagens do Projeto
<img width="1879" height="923" alt="Opera Instantâneo_2025-08-23_154402_localhost" src="https://github.com/user-attachments/assets/4a0a6ddb-a1b5-4ed4-8e1d-ac5ae47c40fb" />
<img width="1879" height="923" alt="Opera Instantâneo_2025-08-23_154423_localhost" src="https://github.com/user-attachments/assets/031edbb5-dc76-4b5f-a9a2-01e0db96473b" />
<img width="1879" height="923" alt="Opera Instantâneo_2025-08-23_154432_localhost" src="https://github.com/user-attachments/assets/10c608e6-eb98-4f03-81d9-f926c2e58081" />
<img width="1879" height="923" alt="Opera Instantâneo_2025-08-23_154618_localhost" src="https://github.com/user-attachments/assets/6ca5b709-1326-49fc-ba3e-9e9ac622f997" />
<img width="1879" height="923" alt="Opera Instantâneo_2025-08-23_154540_localhost" src="https://github.com/user-attachments/assets/d1a3c5b2-b0d3-4f6f-81f1-9b7a529d6ec9" />
<img width="1879" height="923" alt="Opera Instantâneo_2025-08-23_154549_localhost" src="https://github.com/user-attachments/assets/9f9109e6-0636-4411-84aa-40df85d72b2b" />
<img width="1879" height="923" alt="Opera Instantâneo_2025-08-23_154600_localhost" src="https://github.com/user-attachments/assets/b1b78835-b844-49cb-89af-0f591506807e" />
<img width="1879" height="923" alt="Opera Instantâneo_2025-08-23_154607_localhost" src="https://github.com/user-attachments/assets/f78fe58d-8d13-4ade-8e0e-aa8364c5d2dc" />


## 🔒 Acesso ao Painel de Administração
Para acessar o painel de CRUD, utilize as seguintes credenciais:
* **Login:** admin
* **Senha:** admin123

## 🚀 Tecnologias Utilizadas
O projeto foi construído utilizando um conjunto de tecnologias modernas e eficientes:

* **Backend**
  * Java 21, Spring Boot 3.5.3, Spring Security, Spring Data JPA, WebSocket, Apache Kafka
* **Banco de Dados**
  * H2 Database
* **Frontend**
  * Thymeleaf, HTML5, CSS3, JavaScript
* **DevOps**
  * Docker & Docker Compose
* **Build**
  * Apache Gradle

## ⚙️ Como Executar o Projeto Localmente
Siga os passos abaixo para configurar e executar a aplicação em seu ambiente de desenvolvimento.

### Pré-requisitos
* Java JDK 21 ou superior
* Apache Gradle 8.14.2 ou superior
* Docker
* Docker Compose

### Passos
#### 1. Clone o repositório:

   ```bash
   git clone https://github.com/agsjohn/AutoGrid_WebSite.git
   cd AutoGrid_WebSite
   ```

#### 2. Iniciar o serviço do Kafka no Docker

> [!NOTE]
> Certifique-se de que o Docker está em execução.

Na raiz do projeto, execute o seguinte comando para iniciar o serviço do Apache Kafka em segundo plano:

   ```bash
   docker-compose up -d
   ```
Este comando irá baixar e iniciar o container do Kafka, que é uma dependência essencial para a aplicação.

#### 3. Executar a aplicação

Na raiz do projeto, execute o comando de build e run do Gradle:

   ```bash
   ./gradlew bootRun
   ```
Esse comando irá compilar e iniciar a aplicação estará disponível em http://localhost:8080.


# 👨‍💻 Autor
João Vitor M. - agsjohn
