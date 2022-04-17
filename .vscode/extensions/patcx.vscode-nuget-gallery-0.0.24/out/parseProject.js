"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const fs = require("fs");
const path = require("path");
function default_1(projectPath) {
    let projectContent = fs.readFileSync(projectPath, "utf8");
    let document = new dom().parseFromString(projectContent);
    let packagesReferences = xpath.select("//ItemGroup/PackageReference", document);
    let project = {
        path: projectPath,
        projectName: path.basename(projectPath),
        packages: Array()
    };
    packagesReferences.forEach((p) => {
        let version = p.attributes.getNamedItem("Version");
        if (version) {
            version = version.value;
        }
        else {
            version = xpath.select("string(Version)", p);
            if (!version) {
                version = "not specifed";
            }
        }
        let projectPackage = {
            id: p.attributes.getNamedItem("Include").value,
            version: version
        };
        project.packages.push(projectPackage);
    });
    return project;
}
exports.default = default_1;
//# sourceMappingURL=parseProject.js.map