import * as passwordHash from "password-hash";

const auth = Object.create(null);

function getKeyData(api_id, db){
    return new Promise(function (resolve, reject){
        // Check that api_id is a number
        if(typeof(api_id) !== "number"){
            reject(new Error("api_id must be a number"));
        }

        // Pull values out of the request object and form sql_query
        let sql_query = `SELECT * from api_keys
            WHERE api_key_id = "${api_id}";`;
        
        // Get api_key record that has the correct id
        db.all(sql_query, function(err, rows) {
            if (err) {
                reject(new Error(err.message));
            }
            if (rows == undefined){
                console.log("test");
                reject(new Error("Database query is undefined"));
            }else if (rows.length === 0){
                reject(new Error("Invalid key or id."));
            }

            resolve(rows[0]);
        });
    });
}

function compareKeyAndHash(key, hash){
    const keyMatch = passwordHash.default.verify(key,
        hash);
    return keyMatch;
}

auth.authAPIKey = function (req, db){
    return new Promise( function (resolve, reject) {
        const obj = req.body;
        // Check to see if the request object has the correct values
        if (!obj.hasOwnProperty("api_key") || !obj.hasOwnProperty("api_id")){
            reject(new Error("Request must contain an api_id and api_key"));
        }

        // Retrive key data from the database
        getKeyData(obj.api_id, db).then(function (keyData) {
            // Check if the key matches the hash
            if(compareKeyAndHash(obj.api_key, keyData.key_hashed)) {
                if(keyData.active){ // If key is valid and active, resolve
                    resolve(keyData); 
                } else if(!keyData.active){ // Reject if not active
                    reject(new Error("Key is not active"));
                }
            }
            // Reject if otherwise invalid
            reject(new Error("Invalid key or id"));
        }).catch(function (err) {
            reject(err);
        });
    });
};

export default Object.freeze(auth);