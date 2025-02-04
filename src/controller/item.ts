import { Request, ResponseToolkit } from "@hapi/hapi";
import { Decimal } from "decimal.js";

import { Item, itemCreateSchema } from "../entities/item";
import { AppDataSource } from "../util";

class ItemController {
  public async getAll() {
    const items = await AppDataSource.manager.find(Item);

    return items.map((item) => {
      return mapItem(item);
    });
  }

  public async getById(request: Request, response: ResponseToolkit) {
    const { itemId } = request.params;
    try {
      const item = await AppDataSource.manager
        .createQueryBuilder(Item, "item")
        .where("item.id = :id", { id: itemId })
        .getOneOrFail();

      return mapItem(item);
    } catch {
      return response.response().code(404);
    }
  }

  public async create(request: Request, response: ResponseToolkit) {
    const errors = validatePayload(request.payload);
    if (errors) {
      return response.response({ errors }).code(400);
    }

    const { name, price } = request.payload as Item;

    const item = new Item();
    item.name = name;
    item.price = new Decimal(price).toString();
    const savedItem = await AppDataSource.manager.save(item);

    return response.response(mapItem(savedItem)).code(201);
  }

  public async update(request: Request, response: ResponseToolkit) {
    const errors = validatePayload(request.payload);
    if (errors) {
      return response.response({ errors }).code(400);
    }

    const { itemId } = request.params;
    const { name, price } = request.payload as Item;

    const item = await AppDataSource.manager
      .createQueryBuilder(Item, "item")
      .where("item.id = :id", { id: itemId })
      .getOneOrFail();
    item.name = name;
    item.price = new Decimal(price).toString();
    const savedItem = await AppDataSource.manager.save(item);
    return mapItem(savedItem);
  }

  public async delete(request: Request, response: ResponseToolkit) {
    const { itemId } = request.params;

    await AppDataSource.createQueryBuilder()
      .delete()
      .from(Item)
      .where("id = :id", { id: itemId })
      .execute();

    return response.response().code(204);
  }
}

export const itemController = new ItemController();

/* Map item entity to match e2e test
  I prefer use Decimal to handle price because it's more accurate than float
*/
const mapItem = (item: Item) => {
  return {
    id: item.id,
    name: item.name,
    price: new Decimal(item.price).toNumber(),
  };
};

const validatePayload = (payload: any) => {
  const validation = itemCreateSchema.validate(payload, {
    abortEarly: false,
    // Change default error messages to match e2e tests
    messages: {
      "*": "Field {{#label}} is required",
      "number.min": "Field {{#label}} cannot be negative",
    },
  });
  if (validation.error) {
    const errors = validation.error.details.map((error) => {
      return { message: error.message, field: error.context?.key };
    });
    return errors;
  }
};
