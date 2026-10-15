// OpenAPI description of the LedgerLink API, served at /openapi.json and rendered by Swagger UI at /docs.

const errorResponse = {
  type: "object",
  properties: { error: { type: "string" } }
};

const validationError = {
  type: "object",
  description: "Zod validation errors, grouped by field.",
  properties: {
    formErrors: { type: "array", items: { type: "string" } },
    fieldErrors: { type: "object", additionalProperties: { type: "array", items: { type: "string" } } }
  }
};

const secured = [{ bearerAuth: [] as string[] }];

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "LedgerLink API",
    version: "0.1.0",
    description:
      "A small financial-ledger backend built with Node.js, Express, TypeScript, and PostgreSQL. " +
      "Passwords are hashed with bcrypt, sessions use JWT, request bodies are validated with Zod, " +
      "and each client is limited to 60 requests per minute.\n\n" +
      "**Try it:** run `POST /auth/signup`, then `POST /auth/login`, copy the token, click **Authorize**, " +
      "and paste it in to call the protected routes."
  },
  servers: [{ url: "/" }],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Users" },
    { name: "Transactions" }
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Service health",
        responses: {
          "200": {
            description: "The service is running.",
            content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean", example: true } } } } }
          }
        }
      }
    },
    "/health/db": {
      get: {
        tags: ["Health"],
        summary: "Database connectivity check",
        responses: {
          "200": {
            description: "The database is reachable.",
            content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean", example: true }, db: { type: "string", example: "connected" } } } } }
          },
          "503": {
            description: "The database cannot be reached.",
            content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean", example: false }, db: { type: "string", example: "unavailable" } } } } }
          }
        }
      }
    },
    "/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Create an account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Credentials" },
              example: { email: "demo@example.com", password: "secret123" }
            }
          }
        },
        responses: {
          "201": {
            description: "Account created.",
            content: { "application/json": { schema: { $ref: "#/components/schemas/NewUser" } } }
          },
          "400": { description: "Invalid email or password (minimum 6 characters).", content: { "application/json": { schema: validationError } } },
          "409": { description: "Email already in use.", content: { "application/json": { schema: errorResponse } } },
          "500": { description: "Server error.", content: { "application/json": { schema: errorResponse } } }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in and receive a JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Credentials" },
              example: { email: "demo@example.com", password: "secret123" }
            }
          }
        },
        responses: {
          "200": {
            description: "Login succeeded. The token expires after 1 hour.",
            content: { "application/json": { schema: { type: "object", properties: { token: { type: "string" } } } } }
          },
          "400": { description: "Invalid input, or no user with that email.", content: { "application/json": { schema: errorResponse } } },
          "401": { description: "Wrong password.", content: { "application/json": { schema: errorResponse } } },
          "500": { description: "Server error.", content: { "application/json": { schema: errorResponse } } }
        }
      }
    },
    "/users/me": {
      get: {
        tags: ["Users"],
        summary: "Current user profile",
        security: secured,
        responses: {
          "200": { description: "The logged-in user.", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          "401": { description: "Missing or invalid token.", content: { "application/json": { schema: errorResponse } } },
          "500": { description: "Server error.", content: { "application/json": { schema: errorResponse } } }
        }
      }
    },
    "/transactions": {
      get: {
        tags: ["Transactions"],
        summary: "List my transactions, newest first",
        security: secured,
        responses: {
          "200": {
            description: "The logged-in user's transactions.",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Transaction" } } } }
          },
          "401": { description: "Missing or invalid token.", content: { "application/json": { schema: errorResponse } } },
          "500": { description: "Server error.", content: { "application/json": { schema: errorResponse } } }
        }
      },
      post: {
        tags: ["Transactions"],
        summary: "Record a transaction",
        security: secured,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/NewTransaction" },
              example: { amount: 49.99, description: "Book" }
            }
          }
        },
        responses: {
          "201": { description: "Transaction recorded.", content: { "application/json": { schema: { $ref: "#/components/schemas/Transaction" } } } },
          "400": { description: "Amount must be a positive number.", content: { "application/json": { schema: validationError } } },
          "401": { description: "Missing or invalid token.", content: { "application/json": { schema: errorResponse } } },
          "500": { description: "Server error.", content: { "application/json": { schema: errorResponse } } }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    },
    schemas: {
      Credentials: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 }
        }
      },
      NewUser: {
        type: "object",
        properties: { id: { type: "integer", example: 1 }, email: { type: "string", format: "email" } }
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          email: { type: "string", format: "email" },
          created_at: { type: "string", format: "date-time" }
        }
      },
      NewTransaction: {
        type: "object",
        required: ["amount"],
        properties: {
          amount: { type: "number", exclusiveMinimum: true, minimum: 0, example: 49.99 },
          description: { type: "string", example: "Book" }
        }
      },
      Transaction: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          amount: { type: "string", description: "NUMERIC column, returned by PostgreSQL as a string.", example: "49.99" },
          description: { type: "string", nullable: true, example: "Book" },
          created_at: { type: "string", format: "date-time" }
        }
      }
    }
  }
};

const SWAGGER_VERSION = "5.17.14";

export const docsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>LedgerLink API Docs</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_VERSION}/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_VERSION}/swagger-ui-bundle.js"></script>
  <script>
    window.ui = SwaggerUIBundle({
      url: "/openapi.json",
      dom_id: "#swagger-ui",
      persistAuthorization: true
    });
  </script>
</body>
</html>`;
