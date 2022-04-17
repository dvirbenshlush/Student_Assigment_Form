"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TaskManager {
    constructor(executeCallback, notify) {
        this.tasks = {};
        this.isTaskRunning = {};
        this.executeCallback = executeCallback;
        this.notify = notify;
    }
    addTask(task) {
        if (this.tasks[task.name] === undefined || this.tasks[task.name].length === 0) {
            this.tasks[task.name] = [];
            if (this.isTaskRunning[task.name] === true) {
                this.tasks[task.name].push(task);
            }
            else {
                this.execute(task);
            }
        }
        else {
            this.tasks[task.name].push(task);
        }
    }
    handleDidEndTask(e) {
        let taskName = e.execution.task.name;
        this.isTaskRunning[taskName] = false;
        this.sendNotification(taskName, this.tasks[taskName] !== undefined ? this.tasks[taskName].length : 0);
        if (this.tasks[taskName] !== undefined) {
            let task = this.tasks[taskName].shift();
            if (task !== undefined) {
                this.execute(task);
            }
        }
    }
    sendNotification(taskName, remainingTaska) {
        this.notify({ "name": taskName, "remaining": remainingTaska });
    }
    execute(task) {
        this.isTaskRunning[task.name] = true;
        this.executeCallback(task);
    }
}
exports.TaskManager = TaskManager;
//# sourceMappingURL=taskManager.js.map