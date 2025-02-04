import Joi from "joi/lib";
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  Long,
} from "typeorm";

@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: Long;

  @Column()
  name!: string;

  @Column()
  price!: string;
}

export const itemCreateSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
});

export const itemGetSchema = Joi.object({
  itemId: Joi.number().required(),
});
