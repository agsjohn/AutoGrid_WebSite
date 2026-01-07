# AutoGrid - Distributed Vehicle Catalog System

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-green)
![Kafka](https://img.shields.io/badge/Apache_Kafka-Event_Streaming-black)
![Docker](https://img.shields.io/badge/Docker-Containerization-blue)

O **AutoGrid** é um sistema de gerenciamento de catálogo veicular projetado com arquitetura orientada a eventos. O foco do projeto é demonstrar a implementação de **notificações em tempo real** e **segurança robusta** em um ambiente distribuído.

Diferente de um CRUD tradicional, este projeto desacopla o registro do veículo da notificação ao usuário utilizando **Apache Kafka**, garantindo que o sistema de cadastro permaneça responsivo mesmo sob alta carga.

---

## 🏗 Arquitetura do Sistema

O sistema segue uma arquitetura em camadas, utilizando mensageria para comunicação assíncrona entre o módulo de administração e a interface pública.

```mermaid
graph TD
    User((Usuário)) -->|HTTP/WebSocket| Front[Thymeleaf Frontend]
    Admin((Admin)) -->|HTTP Secure| Controller[Spring Controller]
    
    subgraph "Backend Services"
        Controller -->|Grava| DB[(H2/MySQL)]
        Controller -->|Publica Evento| Kafka[Apache Kafka]
        Consumer[Kafka Consumer Service] -->|Lê Tópico| Kafka
    end
    
    Consumer -->|Push Notification| Socket[WebSocket Handler]
    Socket -->|Update| Front
    
    subgraph "External Integrations"
        Controller -.->|Consulta| IBGE[API IBGE Public Data]
    end

```

## 🛠 Tecnologias e Decisões Técnicas

### Backend & Arquitetura

* **Java 21 & Spring Boot 3:** Utilizados pela robustez e ecossistema maduro.
* **Apache Kafka:** Escolhido para desacoplar o processo de "Cadastro" do processo de "Notificação". Isso permite que, no futuro, novos microsserviços (ex: envio de emails de marketing) consumam o mesmo evento sem alterar o código do cadastro.
* **WebSockets (STOMP):** Permite que o cliente receba notificações em tempo real. 
* **Spring Security:** Implementação de autenticação Stateful (Session-based) para proteger as rotas administrativas `/admin/**`.

### DevOps & Infraestrutura

* **Docker & Docker Compose:** O Kafka é orquestrado via contêiner para garantir que o ambiente de desenvolvimento seja idêntico em qualquer máquina, eliminando o problema de "funciona na minha máquina".

---

## ✨ Funcionalidades Principais

### 1. Event-Driven Notification System

Ao cadastrar um veículo, o sistema não apenas salva no banco:

1. O veículo é persistido no banco de dados.
2. Um evento `SendMessageCarro` é publicado no tópico `added-new-car` do Kafka.
3. Um listener assíncrono consome este evento e dispara um alerta via WebSocket para todos os clientes conectados.
*Resultado:* O usuário final vê a notificação do novo carro aparecer na tela em milissegundos.

### 2. Integração com Dados Governamentais (IBGE)

Para garantir a integridade dos dados de localização, o sistema consome a API de dados públicos do IBGE durante o cadastro, evitando erros de digitação em estados e cidades.

### 3. Painel Administrativo Seguro

* Acesso restrito via Spring Security.
* CRUD completo com validações de Bean Validation.

---

## 📸 Screenshots

<img width="100%" alt="Página incial" src="https://github.com/user-attachments/assets/020ff8a9-819f-4b0e-a429-4c2279538848" />
<img width="100%" alt="Página incial_1" src="https://github.com/user-attachments/assets/031edbb5-dc76-4b5f-a9a2-01e0db96473b" />
<img width="100%" alt="Página incial_2" src="https://github.com/user-attachments/assets/10c608e6-eb98-4f03-81d9-f926c2e58081" />
<img width="100%" alt="Página incial_3" src="https://github.com/user-attachments/assets/6ca5b709-1326-49fc-ba3e-9e9ac622f997" />
<img width="100%" alt="Página de busca" src="https://github.com/user-attachments/assets/d1a3c5b2-b0d3-4f6f-81f1-9b7a529d6ec9" />
<img width="100%" alt="Página de login" src="https://github.com/user-attachments/assets/9f9109e6-0636-4411-84aa-40df85d72b2b" />
<img width="100%" alt="Página de CRUD" src="https://github.com/user-attachments/assets/b1b78835-b844-49cb-89af-0f591506807e" />
<img width="100%" alt="Model de novo veículo" src="https://github.com/user-attachments/assets/f78fe58d-8d13-4ade-8e0e-aa8364c5d2dc" />

---

## ⚙️ Como Executar Localmente

### Pré-requisitos

* Java JDK 21
* Docker & Docker Compose

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone https://github.com/agsjohn/AutoGrid_WebSite.git
cd AutoGrid_WebSite

```


2. **Suba a infraestrutura (Kafka):**
```bash
docker-compose up -d

```


*Aguarde alguns segundos para o Kafka estabilizar.*
3. **Execute a aplicação:**
```bash
./gradlew bootRun

```


4. **Acesse:**
* Vitrine: `http://localhost:8080`
* Admin: `http://localhost:8080/painel` (User: `admin` / Pass: `admin123`)



---

## 👨‍💻 Autor

**João Vitor M.**

* [LinkedIn](https://www.linkedin.com/in/joaovitormds)
* [Portfólio](https://agsjohn.github.io/)
