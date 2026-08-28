import { version as uuidVersion } from "uuid";

import orchestrator from "tests/orchestrator.js";
import webserver from "infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/warehouse-schedules", () => {
  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            schedule_date: "2026-08-20",
            schedule_time: "15:00:00",
            client: "Cliente Teste",
            booking: "ABC123",
            inspectorate: "Receita Federal",
            operation_type: "Cross",
            commodity: "Algodão",
            quantity: 100,
            completed: 0,
            notes: "Observação do teste",
          }),
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "Você não possui permissão para executar esta ação.",
        action:
          'Verifique se o seu usuário possui a feature "create:warehouse_schedule"',
        status_code: 403,
      });
    });
  });

  describe("Default user", () => {
    test("With valid data", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: "2026-08-20",
            schedule_time: "15:00:00",
            client: "Cliente Teste",
            booking: "ABC123",
            inspectorate: "Receita Federal",
            operation_type: "Cross",
            commodity: "Algodão",
            quantity: 100,
            completed: 0,
            notes: "Observação do teste",
          }),
        },
      );

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        schedule_date: "2026-08-20",
        schedule_time: "15:00:00",
        client: "Cliente Teste",
        booking: "ABC123",
        inspectorate: "Receita Federal",
        operation_type: "Cross",
        commodity: "Algodão",
        quantity: 100,
        completed: 0,
        balance: 100,
        notes: "Observação do teste",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("Without optional fields", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: "2026-08-20",
            client: "Cliente Teste",
            operation_type: "Cross",
            commodity: "Algodão",
            quantity: 100,
          }),
        },
      );

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        schedule_date: "2026-08-20",
        schedule_time: null,
        client: "Cliente Teste",
        booking: null,
        inspectorate: null,
        operation_type: "Cross",
        commodity: "Algodão",
        quantity: 100,
        completed: 0,
        balance: 100,
        notes: null,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With empty `schedule_date`", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: "",
            client: "Cliente Teste",
            operation_type: "Cross",
            commodity: "Algodão",
            quantity: 100,
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: '"schedule_date" não pode estar em branco.',
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
        key: "schedule_date",
      });
    });

    test("Without `schedule_date`", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            client: "Cliente Teste",
            operation_type: "Cross",
            commodity: "Algodão",
            quantity: 100,
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: '"schedule_date" é um campo obrigatório.',
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
        key: "schedule_date",
      });
    });

    test("With `schedule_date` that is not a string", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: 20260820,
            client: "Cliente Teste",
            operation_type: "Cross",
            commodity: "Algodão",
            quantity: 100,
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: '"schedule_date" deve ser do tipo String.',
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
        key: "schedule_date",
      });
    });

    test("With empty `client`", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: "2026-08-20",
            client: "",
            operation_type: "Cross",
            commodity: "Algodão",
            quantity: 100,
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: '"client" não pode estar em branco.',
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
        key: "client",
      });
    });

    test("Without `client`", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: "2026-08-20",
            operation_type: "Cross",
            commodity: "Algodão",
            quantity: 100,
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: '"client" é um campo obrigatório.',
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
        key: "client",
      });
    });

    test("With `client` that is not a string", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: "2026-08-20",
            client: 123456,
            operation_type: "Cross",
            commodity: "Algodão",
            quantity: 100,
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: '"client" deve ser do tipo String.',
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
        key: "client",
      });
    });

    test("With empty `operation_type`", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: "2026-08-20",
            client: "Cliente Teste",
            operation_type: "",
            commodity: "Algodão",
            quantity: 100,
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: '"operation_type" não pode estar em branco.',
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
        key: "operation_type",
      });
    });

    test("Without `operation_type`", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: "2026-08-20",
            client: "Cliente Teste",
            commodity: "Algodão",
            quantity: 100,
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: '"operation_type" é um campo obrigatório.',
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
        key: "operation_type",
      });
    });

    test("With empty `commodity`", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: "2026-08-20",
            client: "Cliente Teste",
            operation_type: "Cross",
            commodity: "",
            quantity: 100,
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: '"commodity" não pode estar em branco.',
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
        key: "commodity",
      });
    });

    test("Without `commodity`", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: "2026-08-20",
            client: "Cliente Teste",
            operation_type: "Cross",
            quantity: 100,
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: '"commodity" é um campo obrigatório.',
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
        key: "commodity",
      });
    });

    test("With `commodity` that is not a string", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: "2026-08-20",
            client: "Cliente Teste",
            operation_type: "Cross",
            commodity: 123456,
            quantity: 100,
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: '"commodity" deve ser do tipo String.',
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
        key: "commodity",
      });
    });

    test("With `quantity` equal to zero", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: "2026-08-20",
            client: "Cliente Teste",
            operation_type: "Cross",
            commodity: "Algodão",
            quantity: 0,
          }),
        },
      );

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody.quantity).toBe(0);
      expect(responseBody.completed).toBe(0);
      expect(responseBody.balance).toBe(0);
    });

    test("With negative `quantity`", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: "2026-08-20",
            client: "Cliente Teste",
            operation_type: "Cross",
            commodity: "Algodão",
            quantity: -1,
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: '"quantity" deve ser no mínimo 0.',
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
        key: "quantity",
      });
    });

    test("Without `quantity`", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: "2026-08-20",
            client: "Cliente Teste",
            operation_type: "Cross",
            commodity: "Algodão",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: '"quantity" é um campo obrigatório.',
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
        key: "quantity",
      });
    });

    test("With `quantity` that is not an integer", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: "2026-08-20",
            client: "Cliente Teste",
            operation_type: "Cross",
            commodity: "Algodão",
            quantity: 10.5,
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: '"quantity" deve ser um número inteiro.',
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
        key: "quantity",
      });
    });

    test("With `completed` equal to zero", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: "2026-08-20",
            client: "Cliente Teste",
            operation_type: "Cross",
            commodity: "Algodão",
            quantity: 100,
            completed: 0,
          }),
        },
      );

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody.completed).toBe(0);
      expect(responseBody.balance).toBe(100);
    });

    test("Without `completed`, uses default value", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: "2026-08-20",
            client: "Cliente Teste",
            operation_type: "Cross",
            commodity: "Algodão",
            quantity: 100,
          }),
        },
      );

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody.completed).toBe(0);
      expect(responseBody.balance).toBe(100);
    });

    test("With negative `completed`", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: "2026-08-20",
            client: "Cliente Teste",
            operation_type: "Cross",
            commodity: "Algodão",
            quantity: 100,
            completed: -1,
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: '"completed" deve ser no mínimo 0.',
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
        key: "completed",
      });
    });

    test("With optional fields as null", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/warehouse-schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            schedule_date: "2026-08-20",
            schedule_time: null,
            client: "Cliente Teste",
            booking: null,
            inspectorate: null,
            operation_type: "Cross",
            commodity: "Algodão",
            quantity: 100,
            completed: 0,
            notes: null,
          }),
        },
      );

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        schedule_date: "2026-08-20",
        schedule_time: null,
        client: "Cliente Teste",
        booking: null,
        inspectorate: null,
        operation_type: "Cross",
        commodity: "Algodão",
        quantity: 100,
        completed: 0,
        balance: 100,
        notes: null,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
    });
  });
});
