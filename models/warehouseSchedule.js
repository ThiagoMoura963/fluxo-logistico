import database from "infra/database";

async function create(warehouseScheduleInputValues) {
  const newWarehouseSchedule = await runInsertQuery(
    warehouseScheduleInputValues,
  );
  newWarehouseSchedule.balance = calculateBalance(newWarehouseSchedule);
  return newWarehouseSchedule;

  async function runInsertQuery(warehouseScheduleInputValues) {
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

function calculateBalance(warehouseSchedule) {
  return warehouseSchedule.quantity - warehouseSchedule.completed;
}

const warehouseSchedule = {
  create,
};

export default warehouseSchedule;
