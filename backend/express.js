const express = require("express");
const { initializeDatabase } = require("./sequelize.js"); // Utilisation de 'dataBase' tel que défini dans sequelize.js
const Routes = require("./routes/carambarRoutes.js");
const bodyParser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger.js'); // Assurez-vous que ce fichier s'appelle bien swagger.js

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        message: "Hello World",
        endpoints: [
            { description: "All jokes", url: `/blagues` },
            { description: "Only one joke", url: `/blagues/:id` },
            { description: "Random joke", url: `/blagues/random` },
            { description: "Push joke", url: `/blagues/push` },
            { description: "Swagger UI", url: `/api-docs` }
        ]
    });
});

app.use("/blagues", Routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

async function startDatabase() {
    try {
        await initializeDatabase();
        app.listen(port, () => {
            console.log(`Hello World`);
            console.log(`All jokes on https://cda-carambar-back.onrender.com
${port}/blagues`);
            console.log(`Only one joke on https://cda-carambar-back.onrender.com${port}/blagues/:id`);
            console.log(`Random joke on https://cda-carambar-back.onrender.com${port}/blagues/random`);
            console.log(`Push joke on https://cda-carambar-back.onrender.com${port}/blagues/push`);
            console.log(`Swagger UI available at https://cda-carambar-back.onrender.com${port}/api-docs`);
        });
    } catch (err) {
        console.log(err);
    }
}

startDatabase();