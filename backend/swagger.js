const swaggerJsdoc = require("swagger-jsdoc");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Carambar jokes API",
			version: "1.0.0",
			description: "Restful API for carambar, you can read and post joke",
		},
		servers: [
			{
				url: "https://cda-carambar-back.onrender.com",
				description: "joke on render",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
