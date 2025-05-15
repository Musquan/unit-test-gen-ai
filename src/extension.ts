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
      const prompt = `Generate ${framework} unit test cases for the following ${language} code:\n\n${selectedText}`;

      try {
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

        const testCode = response.data.choices[0].message.content;

        const doc = await vscode.workspace.openTextDocument({
          content: testCode,
          language: language
        });
        vscode.window.showTextDocument(doc);
      } catch (error: any) {
        vscode.window.showErrorMessage('Failed to generate tests: ' + error.message);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
