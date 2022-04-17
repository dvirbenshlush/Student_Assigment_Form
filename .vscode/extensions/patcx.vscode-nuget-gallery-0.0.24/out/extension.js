"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const taskManager_1 = require("./taskManager");
const parseProject_1 = require("./parseProject");
const fs = require("fs");
const axios = require('axios').default;
const exec = require('child_process').exec;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function postMessage(panel, command, payload) {
    panel.webview.postMessage({ command: command, payload: payload });
}
function readCredentials(configuration, source, credentialsCallback) {
    let command = "";
    if (process.platform === 'win32') {
        command = "\"" + configuration.credentialProviderFolder + "/CredentialProvider.Microsoft.exe\"";
    }
    else {
        command = "dotnet \"" + configuration.credentialProviderFolder + "/CredentialProvider.Microsoft.dll\"";
    }
    exec(command + " -C -F Json -U " + source, function callback(error, stdout, stderr) {
        console.log(stderr);
        credentialsCallback({ source: source, credentials: JSON.parse(stdout) });
    });
}
function loadProjects(panel) {
    vscode.workspace.findFiles("**/*.{csproj,fsproj,vbproj}").then(files => {
        let projects = Array();
        files.map(x => x.fsPath).forEach(x => {
            let project = parseProject_1.default(x);
            projects.push(project);
        });
        postMessage(panel, "setProjects", projects.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
    });
}
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.start', () => {
        let configuration = vscode.workspace.getConfiguration("NugetGallery");
        const panel = vscode.window.createWebviewPanel('nuget-gallery', // Identifies the type of the webview. Used internally
        'NuGet Gallery', // Title of the panel displayed to the user
        vscode.ViewColumn.One, // Editor column to show the new webview panel in.
        { enableScripts: true } // Webview options. More on these later.
        );
        let taskManager = new taskManager_1.TaskManager(vscode.tasks.executeTask, (e) => {
            if (e.name === "nuget-gallery" && e.remaining === 0) {
                loadProjects(panel);
            }
        });
        vscode.tasks.onDidEndTask(e => taskManager.handleDidEndTask(e));
        panel.webview.onDidReceiveMessage((message) => __awaiter(this, void 0, void 0, function* () {
            if (message.command === "reloadProjects") {
                loadProjects(panel);
            }
            else if (message.command === "reloadSources") {
                postMessage(panel, "setSources", configuration.sources);
            }
            else if (message.command === "getCredentials") {
                readCredentials(configuration, message.source, (cred) => {
                    postMessage(panel, "setCredentials", { source: message.source, credentials: cred });
                });
            }
            else {
                for (let i = 0; i < message.projects.length; i++) {
                    let project = message.projects[i];
                    let args = [message.command, project.projectPath.replace(/\\/g, "/"), "package", message.package.id];
                    if (message.command === 'add') {
                        args.push("-v");
                        args.push(message.version);
                        args.push("-s");
                        args.push(message.source);
                    }
                    let task = new vscode.Task({ type: 'dotnet', task: `dotnet ${message.command}` }, 'nuget-gallery', 'dotnet', new vscode.ShellExecution("dotnet", args));
                    taskManager.addTask(task);
                }
            }
        }), undefined, context.subscriptions);
        let html = fs.readFileSync(path.join(context.extensionPath, 'web/dist', 'index.html'), "utf8");
        panel.webview.html = html;
    }));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map