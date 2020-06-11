const FILE = require("../../tools/files_fun");
var logs = {
    print: function (res,e, reportname, user) {
        let errjson = {
            report: reportname,
            user: user,
            error: e.message  
        }
        FILE.savaPath = "./logs/files/";
        FILE.write(res,"1.log", JSON.stringify(errjson));
    }
}
module.exports = logs; 