import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

export const options = {
  swaggerDefinition: {
    openapi: "3.0.3",
    info: {
      title: "Board Project Node js with Pug",
      version: "1.0.0",
      description: "This is Board Project API service.",
    },
    servers: [
      {
        url: "http://localhost:5050",
      },
    ],
  },
  apis: [
    path.join(__dirname, "/routers/*.js"),
    path.join(__dirname, "/swagger/*"),
    path.join(__dirname, "/models/*.js"),
  ],
};

export const specs = swaggerJsdoc(options);
