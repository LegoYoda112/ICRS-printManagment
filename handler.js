import auth from "./auth.js";

const handlers = Object.create(null);

handlers.getPrinterList = {
    "requestMethod": "GET",
    "needsAuth": false,
    "needsAdmin": false,
    "handle": function (obj, db) {
        // Returns a promise that is fufilled when the database
        // call has finished
        return new Promise(function(resolve, reject) {
            db.all(`SELECT * FROM printers`, function(err, rows) {
                if(err) {
                    console.log(err.message);
                }
                resolve(rows);
            });
        });
    }
};

handlers.updatePrinter = {
    "requestMethod": "POST",
    "needsAuth": true,
    "needsAdmin": false,
    "handle": function(obj, db) {
        return new Promise(function(resolve, reject) {
            // Defines parameters that could be updated
            const parameters = ["type", "IP", "status",
                                "progress", "remaining_time"];
            let sql_query = "UPDATE printers SET ";

            // If a parameter is present in the update object,
            // add its update value to the sql call
            let firstRow = true;
            parameters.forEach( function (parameter, index) {
                if (obj.hasOwnProperty(parameter)){
                    if(!firstRow){
                        sql_query += ", ";
                    }
                    firstRow = false;
                    sql_query += `${parameter} = '${obj[parameter]}'`;
                }
            });

            sql_query += " ";

            // If printer_id is present: search by id
            if (obj.hasOwnProperty("printer_id")) {
                // If name is also present: update name
                if (obj.hasOwnProperty("name")) {
                    sql_query += `name = '${obj.name}' `;
                }
                sql_query += `WHERE printer_id = ${obj.printer_id}`;
            } else if (obj.hasOwnProperty("name")){ 
                // If just name is present: search by name
                sql_query += `WHERE name = '${obj.name}' `;
            } else {
                reject( new Error("Request must include a printer_id or name"));
            }
            
            // Logs the sqlite query, runs it and then returns the new printer list
            console.log(sql_query);
            db.run(sql_query, function(err) {
                if(err) {
                    console.error(err.message);
                    throw new Error(err.message);
                }
                resolve(handlers.getPrinterList.handle(obj, db));
            });
        });
    }
};

handlers.getAllPrints = {
    "requestMethod": "GET",
    "needsAuth": false,
    "needsAdmin": false,
    "handle": function (obj, db) {
        return new Promise(function(resolve, reject) {
            db.all(`SELECT * FROM prints`, function(err, rows) {
                if(err) {
                    console.log(err.message);
                }
                resolve(rows);
            });
        });
    }
};

handlers.addPrint = {
    "requestMethod": "POST",
    "needsAuth": true,
    "needsAdmin": false,
    "handle": function (obj, db) {
        return new Promise(function(resolve, reject){
            const parameters = ["path", "size", "owner_id", "length", 
                            "filament_length", "filament_volume",
                            "printer_id", "datetime"];
            let sql_query = "INSERT INTO prints ";
            let sql_keys = "";
            let sql_values = "";

            if(!obj.hasOwnProperty("owner_id")){
                throw new Error("Print must have an owner_id");
            }

            // If parameters are present in request object,
            // add them to the sql call
            let firstRow = true;
            parameters.forEach( function (parameter, index) {
                if ( obj.hasOwnProperty(parameter) ){
                    if(!firstRow){
                        sql_keys += ", ";
                        sql_values += ", ";
                    }
                    firstRow = false;
                    sql_keys += `'${parameter}'`;

                    if(parameter === "datetime"){
                        sql_values += `datetime('${obj[parameter]}')`;
                    } else {
                        sql_values += `'${obj[parameter]}'`;
                    }
                }
            });

            sql_query += `(${sql_keys}) VALUES (${sql_values})`;

            console.debug(sql_query);

            //Run query and resolve empty
            db.run(sql_query, function(err) {
                if(err) {
                    console.error(err.message);
                    throw new Error(err.message);
                }
                resolve("Success");
            });
        });
    }
};

handlers.searchPrints = {
    "requestMethod": "POST",
    "needsAuth": false,
    "needsAdmin": false,
    "handle": function(obj,db) {
        return new Promise(function(resolve, reject) {
            let sql_query = "SELECT * FROM prints WHERE ";
            const parameters = ["path", "size", "owner_id", "length", 
                            "filament_length", "filament_volume",
                            "printer_id", "datetime"];
            
            // If parameters are present in the request object,
            // add them to the search query with their corresponding
            // comparison operators
            let firstRow = true;
            parameters.forEach( function (parameter, index) {
                if (obj.hasOwnProperty(parameter)){
                    if(!firstRow){
                        sql_query += " AND ";
                    }
                    firstRow = false;
                    sql_query += `${parameter} ${obj[parameter].comparison} `;
                    // Datetime doesn't need quotes around it
                    if (parameter === "datetime"){
                        sql_query += `${obj[parameter].value}`;
                    } else {
                        sql_query += `'${obj[parameter].value}'`;
                    }
                }
            });

            // Debug the query
            // console.debug(sql_query);

            // Run the query and resolve with the result
            db.all(sql_query, function(err, rows) {
                if(err) {
                    console.error(err.message);
                    throw new Error(err.message);
                }
                resolve(rows);
            });
        });
    }
};

function rejectHandle(err){
    return new Promise(function (resolve, reject){
        reject( err );});
}

function authedHandle(req, db, handlerObj){
    return new Promise( function(resolve, reject) {
        // Checks authentication on the key
        auth.authAPIKey(req, db).then(function (keyData) {
            // Checks if admin is required
            // keyData.admin === handlerObj.needsAdmin
            if (!(handlerObj.needsAdmin && !keyData.admin)){
                // Handle request and resolve
                handlerObj.handle(req.body, db).then( function(responseObject){
                    resolve(responseObject);
                });
            } else {
                reject(new Error("Request requires admin key"));
            }
        }).catch(function (err) {
            reject(err);
        });
    });
}

const handler = function (req, db) {
    let requestType = req.params.requestType;
    let handlerObj = handlers[requestType];

    // Check if the handle type exists
    if (handlerObj === undefined){
        return rejectHandle(new Error("Invalid request type"));
    }

    // Check if the request method matches the allowed request method
    if (handlerObj.requestMethod !== req.method){
        return rejectHandle(new Error("Invalid HTTP method type"));
    }

    // Check if request needs authentication to perform
    if(handlerObj.needsAuth){
        return authedHandle(req, db, handlerObj);
    } else {
        return handlerObj.handle(req.body, db);
    }
};

export default Object.freeze(handler);