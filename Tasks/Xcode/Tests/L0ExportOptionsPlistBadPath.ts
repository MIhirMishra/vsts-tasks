
import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'xcode.js');
let tr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

process.env['HOME'] = '/users/test'; //replace with mock of setVariable when task-lib has the support

tr.setInput('actions', 'build');
tr.setInput('configuration', '$(Configuration)');
tr.setInput('sdk', '$(SDK)');
tr.setInput('xcWorkspacePath', '**/*.xcodeproj/*.xcworkspace');
tr.setInput('scheme', 'testScheme');
tr.setInput('xcodeVersion', 'default');
tr.setInput('packageApp', 'true');
tr.setInput('signStyle', 'default');
tr.setInput('signingIdentity', '');
tr.setInput('provProfileUuid', '');
tr.setInput('args', '');
tr.setInput('cwd', '/user/build');
tr.setInput('outputPattern', 'output/$(SDK)/$(Configuration)');
tr.setInput('xcodeDeveloperDir', '');
tr.setInput('useXctool', 'false');
tr.setInput('packageTool', 'xcodebuild');
tr.setInput('xctoolReporter', '');
tr.setInput('publishJUnitResults', 'false');
tr.setInput('archivePath', '/user/build');
tr.setInput('exportPath', '/user/build');
tr.setInput('exportOptions', 'plist');
tr.setInput('exportOptionsPlist', '/user/build/exportOptions.plist');

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "which": {
        "xcodebuild": "/home/bin/xcodebuild",
        "/usr/libexec/PlistBuddy": "/usr/libexec/PlistBuddy"
    },
    "checkPath": {
        "/home/bin/xcodebuild": true,
        "/usr/libexec/PlistBuddy": true
    },
    "filePathSupplied": {
        "archivePath": false,
        "exportOptionsPlist": false
    },
    "getVariable": {
        "build.sourcesDirectory": "/user/build",
        "HOME": "/users/test"
    },
    "exist": {
        "/user/build/_XcodeTaskExport_testScheme": false
    },
    "stats": {
        "/user/build": {
            "isFile": false
        },
        "/user/build/exportOptions.plist": {
            "isFile": false
        }
    },
    "findMatch": {
        "**/*.xcodeproj/*.xcworkspace": [
            "/user/build/fun.xcodeproj/project.xcworkspace"
        ],
        "**/*.app": [
            "/user/build/output/$(SDK)/$(Configuration)/build.sym/Release.iphoneos/fun.app"
        ],
        "**/*.xcarchive": [
            "/user/build/testScheme.xcarchive"
        ]
    },
    "exec": {
        "/home/bin/xcodebuild -version": {
            "code": 0,
            "stdout": "Xcode 8.0"
        },
        "/home/bin/xcodebuild -sdk $(SDK) -configuration $(Configuration) -workspace /user/build/fun.xcodeproj/project.xcworkspace -scheme testScheme build DSTROOT=/user/build/output/$(SDK)/$(Configuration)/build.dst OBJROOT=/user/build/output/$(SDK)/$(Configuration)/build.obj SYMROOT=/user/build/output/$(SDK)/$(Configuration)/build.sym SHARED_PRECOMPS_DIR=/user/build/output/$(SDK)/$(Configuration)/build.pch": {
            "code": 0,
            "stdout": "xcodebuild output here"
        },
        "/home/bin/xcodebuild -workspace /user/build/fun.xcodeproj/project.xcworkspace -scheme testScheme archive -sdk $(SDK) -configuration $(Configuration) -archivePath /user/build/testScheme": {
            "code": 0,
            "stdout": "xcodebuild archive output here"
        }
    }
};
tr.setAnswers(a);

tr.run();

