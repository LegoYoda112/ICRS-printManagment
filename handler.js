const handlers = Object.create(null);

handlers.getPrinterList = function (obj, db) {
    let printers = [];

    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM printers`, (err, rows) => {
            if(err) {
                console.log(err.message);
            }
            printers = rows;
            resolve(printers);
        });
    })
}

handlers.updatePrinter = function(obj, db) {
    return new Promise((resolve, reject) => {
        let sql_query = "UPDATE printers SET ";
        const parameters = ["type", "ip", "status", "progress", "remaining_time"];

        // If a parameter is present in the update object,
        // add its update value to the sql call
        parameters.forEach( function (parameter) {
            if ( obj.hasOwnProperty(parameter) ){
                sql_query += `${parameter} = ${obj[parameter]} `;
            }
        })

        let idPresent = obj.hasOwnProperty('printer_id');
        let namePresent = obj.hasOwnProperty('name');
        
        // If printer_id is present: search by id
        if ( idPresent ) {
            // If name is also present: update name
            if ( namePresent ) {
                sql_query += `name = ${obj.name} `;
            }

            sql_query += `WHERE printer_id = ${obj.printer_id}`;
        } else { // If just name is present: search by name
            sql_query += `WHERE name = ${obj.name} `;
        }

        console.log(sql_query);
        
        resolve({'sql': sql_query});
        // db.all(`UPDATE FROM printers SET progress = %s remaining_time = % remaining_time) = `, (err, rows) => {
        //     if(err) {
        //         console.log(err.message);
        //     }
        //     printers = rows;
        //     resolve(printers);
        // });
    })
}

handlers.getLatestPrints = function () {
    return {"test": "Hello from latest prints!"};
}

// handlers.testAdd = function (obj, db) {
//     const message = obj.message;
//     db.run(`INSERT INTO testing(message) VALUES ("${message}")`, (err) => {
//         if(err) {
//             console.log(err.message);
//         }
//         console.log("Saved message to database.");
//     });
// };

// handlers.listMessages = function (obj, db) {
//     let messages = [];

//     return new Promise((resolve, reject) => {
//         db.all(`SELECT * FROM testing`, (err, rows) => {
//             if(err) {
//                 console.log(err.message);
//             }
//             console.log(rows);
//             messages = rows;
//             resolve(messages);
//         });
//     })
// }

const handler = function (obj, db) {
    const type = obj.requestType;

    return handlers[type](obj, db);
};

export default Object.freeze(handler);