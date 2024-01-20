const fs = require("fs")
const encryption = require("./encryption.js")

const generateKey = function() {
    let key = encryption.BufferToString(encryption.generateKey())
    console.log("Store this key somewhere SECURE, like in ENV or a place no one else but you can see")
    console.log("Key:", key)
    return key
}

const lindb = class {
    constructor(init = { 
        path: "db.ldb", // -> Default Path
        key: null, // -> Encryption Key [optional]
        encryptif_nokey: true, // -> If no key is provided, it will generate a key and encrypt
        auto_save: true // -> Self Explanatory, Auto save data on each function call
    }) {
        init.path = init.path || "lindb.ldb";
        init.encryptif_nokey = init.encryptif_nokey == undefined && true || init.encryptif_nokey;
        init.auto_save = init.auto_save == undefined && true || init.auto_save;
        init.key = init.key || (init.encryptif_nokey && generateKey() || null);

        let data = {}
        try {
            data = fs.readFileSync(init.path, "utf-8");
            if (init.key) {
                data = JSON.parse(encryption.decrypt(data, encryption.getKey(init.key)));
            } else {
                data = JSON.parse(data);
            }
        } catch(err) {
            data = {};
        }

        this.saveAllData = function() {
            let stringified = JSON.stringify(data);
            fs.writeFileSync(init.path, (init.key && encryption.encrypt(stringified, encryption.getKey(init.key)) || stringified));
        }; this.saveAllData()

        // < ------_File Functions_------ > \\
        this.clear = function(confirmation) {
            if (!confirmation) {
                return;
            }
            dbstorage.data = {};
            this.saveAllData();
        }
        this.entries = function(key) { // gets all keys in data [ not its children ] and see if it's index matches key
            let list = {}
            for (var index in data) {
                if (typeof(index) == "string" && index.includes(key)) {
                    list[index] = data[index]
                }
            }
            return list
        }
        this.get = function(key, multiple_index = true) { // return data[key]
            key = typeof(key) == "string" && key || null;
            if (!key) {
                return null;
            }

            if(!multiple_index) {
                return data[key]
            } else {
                let split = key.split(typeof(multiple_index) == "string" && multiple_index || ".");
                let base = data;

                for (var index in split) {
                    let indvalue = split[index];
                    if (!indvalue || !indvalue.length) {
                        break;
                    }
                    if (index == split.length - 1) {
                        base = base[indvalue];
                    } else {
                        base[indvalue] = typeof(base[indvalue]) == "object" && !base[indvalue].push && base[indvalue] || null;
                        if (!base) {
                            return base
                        } else {
                            base = base[indvalue]
                        }
                    }
                }

                return base;
            }
        }
        this.set = function(key, value, multiple_index = true) { // data[key] = value
            key = typeof(key) == "string" && key || null;
            if (!key) {
                return null;
            }

            if(!multiple_index) {
                data[key] = value;
            } else {
                let split = key.split(typeof(multiple_index) == "string" && multiple_index || ".");
                let base = data;

                for (var index in split) {
                    let indvalue = split[index];
                    if (!indvalue || !indvalue.length) {
                        break;
                    }
                    if (index == split.length - 1) {
                        if (value == undefined) {
                            base[indvalue] = undefined
                            delete base[indvalue];
                        } else {
                            base[indvalue] = value;
                        }
                    } else {
                        base[indvalue] = typeof(base[indvalue]) == "object" && !base[indvalue].push && base[indvalue] || {};
                        base = base[indvalue];
                    }
                }

                return true;
            }

            if (init.auto_save) {
                this.saveAllData();
            }
        }
        this.delete = function(key, multiple_index = true) {
            return this.set(key, undefined, multiple_index)
        }
        this.del = this.delete
    }
}

/*

*/
module.exports = lindb
module.exports.generateKey = generateKey