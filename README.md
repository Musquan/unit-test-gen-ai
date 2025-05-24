# 🧪 AI Unit Test Generator - VS Code Extension

Generate unit test cases instantly for your selected methods or classes using OpenAI's API — all without leaving your editor.

## ✨ Features

- Select any method or class in your code
- Choose a unit testing framework:
  - `JUnit`, `PyTest`, `Mocha`, `Jest`, `NUnit`
- Instantly generate test cases using OpenAI (GPT-4)
- Opens the generated tests in a new editor tab

## 🚀 How to Use

1. Select the code (method/class) in the editor you want to generate tests for.  
2. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).  
3. Run the command: **`Generate Unit Tests`**.  
4. Choose your preferred test framework.  
5. The generated test code will appear in a new editor tab.

## ⚙️ Setup

1. Clone the Repo  
    ```bash
    git clone https://github.com/Musquan/unit-test-gen-ai.git
    cd unit-test-gen-ai
    ```

2. Install Dependencies  
    ```bash
    npm install
    ```

3. Configure Environment Variables  
    Create a `.env` file in the root of the project:  
    ```bash
    touch .env
    ```
    Add your OpenAI API key to the `.env` file:  
    ```
    API_KEY=your_openai_api_key_here
    ```
4. Launch the Extension  
    - Open the project in **VS Code**  
    - Press `F5` to open a new **Extension Development Host** window  
    - Select the method or class you want to generate unit test cases for.  
    - Use the Command Palette (`Ctrl+Shift+P`) and run: **Generate Unit Tests**  
      OR  
    - Right click and select **Generate Unit Tests**.
