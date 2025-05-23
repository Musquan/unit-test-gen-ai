import * as vscode from 'vscode';
import axios from 'axios';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'unitTestGenerator.generateTests',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const selectedText = editor.document.getText(editor.selection);
      if (!selectedText) {
        vscode.window.showWarningMessage("Please select a method or class to generate tests for.");
        return;
      }

      const language = editor.document.languageId;
      const framework = await vscode.window.showQuickPick(
        ['JUnit', 'PyTest', 'Mocha', 'Jest', 'NUnit'],
        { placeHolder: 'Select your unit test framework' }
      );
      if (!framework) return;

      const apiKey = process.env.API_KEY; 
      console.log('API Key:', apiKey);
      const prompt = `You are an expert software engineer and test writer. 
      Generate complete, production-ready unit tests using the **${framework}** framework for the following ${language} code. 
      
      - Do not include explanations or TODOs - only return the full test code inside a single code block.
      - Include both **positive** and **negative** test cases.
      - Cover all logical branches and edge cases.
      - Assume all dependencies are imported correctly.
      - The code should be directly usable in a real project with minimal changes.

      Code:
      \`\`\`${language}
      ${selectedText}
      \`\`\`
      `;

      try {
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Generating unit tests...",
            cancellable: false,
          },
          async() => {
                    const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );
            const fullResponse = response.data.choices[0].message.content;
            const match = fullResponse.match(/```(?:\w+)?\n([\s\S]*?)```/);
            const testCode = match ? match[1].trim() : fullResponse;

            if(!match)  {
              vscode.window.showWarningMessage("Could not extract a code block - showing full response.");
            }

            const doc = await vscode.workspace.openTextDocument({
              content: testCode,
              language: language
            });
            vscode.window.showTextDocument(doc);
          }
        );
      } catch (error: any) {
        vscode.window.showErrorMessage('Failed to generate tests: ' + error.message);
      }
    }
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
