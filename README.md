# Simulador de Agente Pokémon

Este projeto é um simulador de agentes baseado no universo Pokémon.

## Como configurar o ambiente

1. **Clonar o repositório**  
   Clone este repositório para sua máquina local utilizando o comando:
   ```bash
   git clone https://github.com/MoreiraAlex/Simulador-de-Agente-Pokemon.git
   ```

2. **Instalar dependências**  
   Execute o comando abaixo para instalar as dependências do projeto:
   ```bash
   npm install
   ```

3. **Configurar ESLint**  
   Certifique-se de que a extensão **ESLint** está ativa no seu editor.

4. **Configurar o arquivo `settings.json`**  
   No VS Code, abra as configurações do usuário no formato JSON (pressione `F1` e procure por `Open User Settings (JSON)`) e adicione o seguinte conteúdo:
   ```json
   "editor.codeActionsOnSave": {
       "source.fixAll.eslint": "always"
   }
   ```

## Como executar o projeto

1. **Instalar a extensão Live Server**
Para executar o projeto corretamente, você precisará da extensão Live Server no VS Code. Para instalar, siga os seguintes passos:
   
   1. No VS Code, vá até a aba de Extensões (ou pressione Ctrl+Shift+X).

   2. Busque por Live Server e clique em Instalar.

2. **Executar o projeto**
Após a instalação da extensão, siga os passos abaixo para executar o projeto:

   1. Abra o arquivo index.html no VS Code.

   2. Clique com o botão direito do mouse sobre o arquivo index.html e selecione a opção "Open with Live Server".

3. **Acessar o projeto no navegador**
Após o Live Server abrir a página no navegador, acesse a seguinte URL:
   ```bash
   http://localhost:5500/src   
   ```

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).