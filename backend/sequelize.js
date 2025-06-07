const { Sequelize, DataTypes } = require("sequelize");
const e = require("express");

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "./joke.db",
});

const Joke = sequelize.define(
	"Joke",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		question: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		answer: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		tableName: "jokes",
		timestamps: false,
	},
);

const jokeData = [
	{
		question: "Quelle est la femelle du hamster ?",
		answer: "L'Amsterdam.",
	},
	{
		question: "Que dit un oignon quand il se cogne ?",
		answer: "Aïe.",
	},
	{
		question: "Quel est l'animal le plus heureux ?",
		answer: "Le hibou, parce que sa femme est chouette.",
	},
	{
		question: "Pourquoi le football c'est rigolo ?",
		answer: "Parce que Thierry en rit.",
	},
	{
		question: "Quel est le sport le plus fruité ?",
		answer:
			"La boxe, parce que tu te prends des pêches dans la poire et tu tombes dans les pommes.",
	},
	{
		question: "Que se fait un Schtroumpf quand il tombe ?",
		answer: "Un Bleu.",
	},
	{
		question: "Quel est le comble pour un marin ?",
		answer: "Avoir le nez qui coule.",
	},
	{
		question: "Qu'est ce que les enfants usent le plus à l'école ?",
		answer: "Le professeur.",
	},
	{
		question: "Quel est le sport le plus silencieux ?",
		answer: "Le para-chuuuut.",
	},
	{
		question: "Quel est le comble pour un joueur de bowling ?",
		answer: "C'est de perdre la boule.",
	},
];

async function initializeDatabase() {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
		await sequelize.sync({ force: true });
		console.log("The table for the User model was just (re)created!");
		const push = await Joke.bulkCreate(jokeData);
		console.log(`${push.length} joke pushed successfully.`);
	} catch (error) {
		console.error("Database dont work normally, error:", error);
	}
}

module.exports = {
	initializeDatabase,
	Joke,
};
