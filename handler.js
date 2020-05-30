const handlers = Object.create(null);

handlers.test = function () {
    return {"status": "good?"};
};

handlers.testAdd = function (obj, db) {
    const message = obj.message;
    db.run(`INSERT INTO testing(message) VALUES ("${message}")`, (err) => {
        if(err) {
            console.log(err.message);
        }
        console.log('Saved message to database.');
    });
};

handlers.listMessages = function (obj, db) {
    let messages = [];

    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM testing`, (err, rows) => {
            if(err) {
                console.log(err.message);
            }
            console.log(rows);
            messages = rows;
            resolve(messages);
        });
    })
}

const handler = function (obj, db) {
    const type = obj.type;
    console.log(type);

    return handlers[type](obj, db);
};

export default Object.freeze(handler);