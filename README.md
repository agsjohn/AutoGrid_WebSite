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

* **Backend**
  * Java 21, Spring Boot 3.5.3, Spring Security, Spring Data JPA, WebSocket, Apache Kafka
* **Banco de Dados**
  * H2 Database
* **Frontend**
  * Thymeleaf, HTML5, CSS3, JavaScript
* **DevOps**
  * Docker & Docker Compose
* **Build**
  * Apacha Gradle

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

#### 2. Executar a Aplicação

> [!NOTE]
> Certifique-se de que o Docker está em execução.

Na raiz do projeto, execute o seguinte comando: 

```bash
docker-compose up --build
```
Este comando irá construir as imagens necessárias e iniciar todos os serviços definidos no seu docker-compose.yml, incluindo o servidor do Kafka.

A aplicação estará disponível em http://localhost:8080.


# 👨‍💻 Autor
João Vitor M. - agsjohn
