const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./joke.db", (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log("good");
	}
});

db.close((err) => {
	if (err) {
		console.log(err);
	} else {
		console.log("bye");
	}
});
