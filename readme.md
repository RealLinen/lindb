# Lindb - A Lightweight Node.js Database with Encryption

Lindb is a simple and lightweight Node.js database module designed for ease of use and flexibility. It includes built-in encryption features to secure your data. Lindb allows you to store and retrieve data using key-value pairs in a structured way.

## Installation

To use Lindb in your Node.js project, follow these steps:

1. Install Lindb using npm:

   ```bash
   npm install lindb
   ```

2. Require Lindb in your code:

   ```javascript
   const Lindb = require('lindb');
   ```

#### Getting Started

### Creating a Lindb Instance

```javascript
const db = new Lindb({
    path: "db.ldb", // Specify the database file path (default is "lindb.ldb")
    key: null, // Key for encrypting and decrypting data (optional, auto-generated if not provided unless encryptif_nokey is set to false)
    encryptif_nokey: true, // Auto-generate key and encrypt if no key is provided
    auto_save: true // Enable auto-save on each function call
});
```

### Storing, Retrieving and Deleting Data

```javascript
// Setting, Getting and Deleting data
db.set("hello", "value1");
console.log(db.get("hello")); // Output: "value1"

db.set("h1e2l3l4o", "value2");
console.log(db.get("h1e2l3l4o")); // Output: "value2"

db.delete("hello")
console.log(db.get("hello")); // Output: undefined
```

### Clearing Data

```javascript
db.clear(true)
```

### Entries - Searching for Keys Matching a Certain Word

```javascript
db.set("key1", "1");
db.set("key2", "2");
db.set("key3", "3");
db.set("stillkey4", "4");
db.set("index5", "5");

console.log(db.entries("key"));
/* Output: 
   {
     key1: "1",
     key2: "2",
     key3: "3",
     stillkey4: "4"    
   }
   
   index5 will not be shown because it doesn't include the word "key"
*/
```

### Nested Data

```javascript
// Example 1: if  'Users' does not exist, it will be created as an object ( {} ) 
db.set("Users.testuser", { 
    password: "example"
});

// Example 2: Multiple Indexes [ "Config" and "testuser" will be created as {}]
db.set("Config.testuser.banned", true);

// Example 3: Specifying a custom index split [ the same as above will happen ]
db.set("Config>testuser>banned", true, ">");

// Example 4: Disabling index split
db.set("Test.testuser.banned", true, false);
/* 
If the third argument/multiple indexes is false, it will create new data as: 
this.data["Test.testuser.banned"] = true 
instead of 
this.data["Test"]["testuser"]["banned"] = true
*/
```

## Important Note on Encryption

If encryption is enabled, ensure that you store the encryption key securely. The key is generated during the initialization of Lindb and should be stored in a secure environment, such as environment variables.

```javascript
// Example of generating an encryption key
const key = db.generateKey();
console.log("Encryption Key:", key);
```

## Contributing

If you encounter any issues or have suggestions for improvements, feel free to contribute to Lindb on [GitHub](https://github.com/RealLinen/lindb).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.