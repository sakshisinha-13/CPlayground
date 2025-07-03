// const fs = require("fs");
// const path = require("path");
// const { exec } = require("child_process");

// const isWindows = process.platform === "win32";
// const WORKSPACE = path.join(__dirname, "../../temp"); // path adjusted for compiler-service
// if (!fs.existsSync(WORKSPACE)) fs.mkdirSync(WORKSPACE);

// const LANG_CONFIG = {
//   javascript: {
//     file: "Main.js",
//     run: "node Main.js",
//   },
//   python: {
//     file: "Main.py",
//     run: isWindows ? "python Main.py" : "python3 Main.py",
//   },
//   c_cpp: {
//     file: "Main.cpp",
//     compile: isWindows ? "g++ Main.cpp -o Main.exe" : "g++ Main.cpp -o Main",
//     run: isWindows ? "Main.exe" : "./Main",
//   },
// };

// const executeCode = async (code, language, testCases = []) => {
//   const cfg = LANG_CONFIG[language];
//   if (!cfg) throw new Error("❌ Unsupported language");

//   const filePath = path.join(WORKSPACE, cfg.file);
//   fs.writeFileSync(filePath, code); // Save code to file

//   // Compile if needed
//   if (cfg.compile) {
//     console.log("🔧 Compiling...");
//     await new Promise((resolve, reject) => {
//       exec(cfg.compile, { cwd: WORKSPACE }, (err, stdout, stderr) => {
//         if (err) {
//           console.error("❌ Compilation error:", stderr || err.message);
//           return reject(stderr || err.message);
//         }
//         resolve(stdout);
//       });
//     });
//     console.log("✅ Compilation successful");
//   }

//   // Execute test cases
//   // const results = await Promise.all(
//   //   testCases.map(tc => {
//   //     console.log("🚀 Running Test Case:", tc.input);

//   //     return new Promise(resolve => {
//   //       const proc = exec(cfg.run, { cwd: WORKSPACE, timeout: 5000 }, (err, stdout, stderr) => {
//   //         const output = (err ? stderr || err.message : stdout).trim();
//   //         const expected = (tc.expectedOutput || "").trim();

//   //         resolve({
//   //           input: tc.input,
//   //           expectedOutput: expected,
//   //           actualOutput: output,
//   //           status: output === expected ? "✅ Accepted" : "❌ Failed",
//   //           passed: output === expected
//   //         });
//   //       });

//   //       if (proc.stdin) {
//   //         proc.stdin.write((tc.input || "").replace(/\\n/g, "\n"));
//   //         proc.stdin.end();
//   //       }
//   //     });
//   //   })
//   // );
// const output = (err ? stderr || err.message : stdout).trim();
// const expected = (tc.expectedOutput || "").trim();

// const result = {
//   input: tc.input,
//   expectedOutput: expected,
//   actualOutput: output,
// };

// if (expected === "") {
//   // ✅ Skip status if no expected output
//   result.status = "⚠️ Custom Run";
//   result.passed = null;
// } else {
//   result.status = output === expected ? "✅ Accepted" : "❌ Failed";
//   result.passed = output === expected;
// }

// resolve(result);

//   return result;
// };

// module.exports = { executeCode };

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const isWindows = process.platform === "win32";
const WORKSPACE = path.join(__dirname, "../../temp");
if (!fs.existsSync(WORKSPACE)) fs.mkdirSync(WORKSPACE);

const LANG_CONFIG = {
  javascript: {
    file: "Main.js",
    run: "node Main.js",
  },
  python: {
    file: "Main.py",
    run: isWindows ? "python Main.py" : "python3 Main.py",
  },
  c_cpp: {
    file: "Main.cpp",
    compile: isWindows ? "g++ Main.cpp -o Main.exe" : "g++ Main.cpp -o Main",
    run: isWindows ? "Main.exe" : "./Main",
  },
};

// const executeCode = async (code, language, testCases = []) => {
//   const cfg = LANG_CONFIG[language];
//   if (!cfg) throw new Error("❌ Unsupported language");

//   const filePath = path.join(WORKSPACE, cfg.file);
//   fs.writeFileSync(filePath, code);

//   // Compile if needed
//   if (cfg.compile) {
//     console.log("🔧 Compiling...");
//     await new Promise((resolve, reject) => {
//       exec(cfg.compile, { cwd: WORKSPACE }, (err, stdout, stderr) => {
//         if (err) {
//           console.error("❌ Compilation error:", stderr || err.message);
//           return reject(stderr || err.message);
//         }
//         resolve(stdout);
//       });
//     });
//     console.log("✅ Compilation successful");
//   }

//   // Run test cases
//   // const results = await Promise.all(
//   //   testCases.map((tc) => {
//   //     return new Promise((resolve) => {
//   //       const proc = exec(cfg.run, { cwd: WORKSPACE, timeout: 5000 }, (err, stdout, stderr) => {
//   //         const output = (err ? stderr || err.message : stdout).trim();
//   //         const expected = (tc.expectedOutput || "").trim();

//   //         const result = {
//   //           input: tc.input,
//   //           expectedOutput: expected,
//   //           actualOutput: output,
//   //         };

//   //         if (expected === "") {
//   //           result.status = "⚠️ Custom Run";
//   //           result.passed = null;
//   //         } else {
//   //           result.status = output === expected ? "✅ Accepted" : "❌ Failed";
//   //           result.passed = output === expected;
//   //         }

//   //         resolve(result);
//   //       });

//   //       if (proc.stdin) {
//   //         proc.stdin.write(tc.input || "");
//   //         proc.stdin.end();
//   //       }
//   //     });
//   //   })
//   // );
//   const output = (err ? stderr || err.message : stdout).trim();
// const expected = (tc.expectedOutput || "").trim();

// const result = {
//   input: tc.input,
//   expectedOutput: expected,
//   actualOutput: output,
// };

// if (expected === "") {
//   // ✅ Skip status if no expected output
//   result.status = "⚠️ Custom Run";
//   result.passed = null;
// } else {
//   result.status = output === expected ? "✅ Accepted" : "❌ Failed";
//   result.passed = output === expected;
// }

// resolve(result);


//   return results;
// };
const executeCode = async (code, language, testCases = []) => {
  const cfg = LANG_CONFIG[language];
  if (!cfg) throw new Error("❌ Unsupported language");

  const filePath = path.join(WORKSPACE, cfg.file);
  fs.writeFileSync(filePath, code);

  // Compile if needed
  if (cfg.compile) {
    console.log("🔧 Compiling...");
    await new Promise((resolve, reject) => {
      exec(cfg.compile, { cwd: WORKSPACE }, (err, stdout, stderr) => {
        if (err) {
          console.error("❌ Compilation error:", stderr || err.message);
          return reject(stderr || err.message);
        }
        resolve(stdout);
      });
    });
    console.log("✅ Compilation successful");
  }

  // ✅ Run test cases one by one (including custom input)
  const results = await Promise.all(
    testCases.map((tc) => {
      return new Promise((resolve) => {
        const proc = exec(cfg.run, { cwd: WORKSPACE, timeout: 5000 }, (err, stdout, stderr) => {
          const output = (err ? stderr || err.message : stdout).trim();
          const expected = (tc.expectedOutput || "").trim();

          const result = {
            input: tc.input,
            expectedOutput: expected,
            actualOutput: output,
          };

          if (expected === "") {
            result.status = "⚠️ Custom Run";
            result.passed = null;
          } else {
            result.status = output === expected ? "✅ Accepted" : "❌ Failed";
            result.passed = output === expected;
          }

          resolve(result);
        });

        if (proc.stdin) {
          proc.stdin.write((tc.input || "").replace(/\\n/g, "\n"));
          proc.stdin.end();
        }
      });
    })
  );

  return results;
};


module.exports = { executeCode };
