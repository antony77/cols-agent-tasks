"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmrm = require("azure-pipelines-task-lib/mock-run");
const path = require("path");
const fs = require("fs");
let rootDir = path.join(__dirname, '../../Tasks', 'VersionAssemblies');
let taskPath = path.join(rootDir, 'versionAssemblies.js');
let tmr = new tmrm.TaskMockRunner(taskPath);
// set up a tmp file for the test
var workingFolder = path.join(__dirname, "working");
if (!fs.existsSync(workingFolder)) {
    fs.mkdirSync(workingFolder);
}
var tmpFile = path.join(workingFolder, "AssemblyInfo.cs");
// provide answers for task mock
let a = {
    "checkPath": {
        "working": true
    },
    "findMatch": {
        "**/AssemblyInfo.*": [tmpFile]
    }
};
tmr.setAnswers(a);
// mock the fs
fs.writeFile(tmpFile, `
[assembly: AssemblyTitle("TestAsm")]
[assembly: AssemblyProduct("TestAsm")]
[assembly: AssemblyCopyright("Copyright © 2016")]
// The following GUID is for the ID of the typelib if this project is exposed to COM
[assembly: Guid("994fa927-3e6f-4794-a442-5003ca450d2b")]
[assembly: AssemblyVersion("1.0.0")]
[assembly: AssemblyFileVersion("1.0.0")]
`, (err) => {
    // set inputs
    tmr.setInput('sourcePath', "working");
    tmr.setInput('filePattern', '**/AssemblyInfo.*');
    tmr.setInput('versionSource', 'buildNumber');
    tmr.setInput('versionFormat', 'fourParts');
    tmr.setInput('replaceVersionFormat', 'fourParts');
    tmr.setInput('buildRegexIndex', '0');
    tmr.setInput('replaceRegex', '');
    tmr.setInput('replacePrefix', '');
    tmr.setInput('replacePostfix', '');
    tmr.setInput('failIfNoMatchFound', 'true');
    // set variables
    process.env["BUILD_BUILDNUMBER"] = "1.5.2.3";
    tmr.run();
});
//# sourceMappingURL=test-failIfNotFound.js.map