import controller from "infra/controller.js";
import { createRouter } from "next-connect";
import warehouseSchedule from "models/warehouseSchedule.js";
import authorization from "models/authorization.js";
import validator from "models/validator.js";

export default createRouter()
  .use(controller.injectAnonymousOrUser)
  .post(controller.canRequest("create:warehouse_schedule"), postHandler)
  .handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userTryingToPost = request.context.user;
  const warehouseScheduleInputValues = request.body;
  const cleanValues = validator(warehouseScheduleInputValues, {
    schedule_date: true,
    schedule_time: true,
    client: true,
    booking: true,
    inspectorate: true,
    operation_type: true,
    commodity: true,
    quantity: true,
    completed: true,
    notes: true,
  });

  const newWarehouseSchedule = await warehouseSchedule.create(cleanValues);

  const secureOutputValues = authorization.filterOutput(
    userTryingToPost,
    "read:warehouse_schedule",
    newWarehouseSchedule,
  );

  return response.status(201).json(secureOutputValues);
}
