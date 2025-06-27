# 🎮 MATCH HUB

Projeto desenvolvido para a disciplina *Happy Game* da **FIAP**.

## 📺 Vídeos das fases do projeto

* **Fase 1**: [Apresentação Fase 1](https://www.youtube.com/watch?v=hsEQwwoEEK0)
* **Fase 2**: [Apresentação Fase 2](https://www.youtube.com/watch?v=IAaclmrmPZU)
* **Fase 3**: [Apresentação Fase 3](https://www.youtube.com/watch?v=xgC5VPvFw4w)
* **Fase 4**: [Apresentação Fase 4](https://www.youtube.com/watch?v=iK2lrtsPago&feature=youtu.be)

---

## 🚀 Como rodar o projeto localmente

Este repositório contém **dois projetos**:

* `match-hub` → **Frontend** com Next.js
* `backend-match-hub` → **Backend** com Spring Boot (Java 21)

---

### 📦 Frontend (Next.js)

> Local: `./match-hub`

#### Pré‑requisitos

* Node.js 18+
* NPM (ou Yarn)

#### Passos para iniciar

```bash
cd match-hub
npm install        # instala as dependências
npm run dev        # inicia o servidor de desenvolvimento
```

Acesse no navegador: `http://localhost:3000`

---

### 📦 Backend (Java 21 / Spring Boot)

> Local: `./backend-match-hub`

#### Pré‑requisitos

* Java 21 (JDK)
* IDE com suporte a Spring (IntelliJ, VS Code, Eclipse, etc.)

#### Passos para iniciar

1. **Acessar a pasta do backend**

   ```bash
   cd backend-match-hub
   ```

2. **Instalar dependências e compilar**

   ```bash
   mvn clean install   # ou: ./mvnw clean install
   ```

3. **Executar a aplicação**

   ```bash
   mvn spring-boot:run # ou: ./mvnw spring-boot:run
   ```

Após a inicialização, a API REST estará disponível em:
[http://localhost:8080](http://localhost:8080)

---

## 📁 Estrutura do Repositório

| <br/>
├── match-hub              # Frontend (Next.js) <br/>
└── backend-match-hub      # Backend (Spring Boot / Java 21)

---

## 📬 Contato

Desenvolvido por estudantes da FIAP para a disciplina *Happy Game*.
