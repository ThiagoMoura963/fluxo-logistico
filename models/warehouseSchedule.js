import database from "infra/database";
import { ValidationError } from "infra/errors.js";

async function create(warehouseScheduleInputValues) {
  const newWarehouseSchedule = await runInsertQuery(
    warehouseScheduleInputValues,
  );
  newWarehouseSchedule.balance = calculateBalance(newWarehouseSchedule);
  return newWarehouseSchedule;

  async function runInsertQuery(warehouseScheduleInputValues) {
    await validateUniqueActiveBooking(warehouseScheduleInputValues.booking);

    const results = await database.query({
      text: `
        INSERT INTO warehouse_schedules (
          schedule_date,
          schedule_time,
          client,
          booking,
          inspectorate,
          operation_type,
          commodity,
          quantity,
          completed,
          notes
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10
        )
        RETURNING *;
      `,
      values: [
        warehouseScheduleInputValues.schedule_date,
        warehouseScheduleInputValues.schedule_time,
        warehouseScheduleInputValues.client,
        warehouseScheduleInputValues.booking,
        warehouseScheduleInputValues.inspectorate,
        warehouseScheduleInputValues.operation_type,
        warehouseScheduleInputValues.commodity,
        warehouseScheduleInputValues.quantity,
        warehouseScheduleInputValues.completed,
        warehouseScheduleInputValues.notes,
      ],
    });

    return results.rows[0];
  }
}

async function validateUniqueActiveBooking(booking) {
  const results = await database.query({
    text: `
      SELECT
        booking
      FROM
        warehouse_schedules
      WHERE
        booking = $1
        AND completed < quantity 
      ;`,
    values: [booking],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message:
        "O booking informada já está vinculado a uma programação em andamento.",
      action:
        "Aguarde a conclusão da programação atual para utilizar este booking novamente.",
      key: "booking",
    });
  }
}

function calculateBalance(warehouseSchedule) {
  return warehouseSchedule.quantity - warehouseSchedule.completed;
}

const warehouseSchedule = {
  create,
};

export default warehouseSchedule;
