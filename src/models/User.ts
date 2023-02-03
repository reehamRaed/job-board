import { Document, model, Schema } from "mongoose";
import { IVacancy} from "./Vacancy";

/**
 * Type to model the User Schema for TypeScript.
  * @param firstName:string
  * @param lastName:string
 * @param email:string
 * @param password:string
 */

type vacancyItem = {
  id: IVacancy["_id"];
  date: Date;
};
export type TUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  vacancies?: vacancyItem[];
};

/**
 * Mongoose Document based on TUser for TypeScript.
 * https://mongoosejs.com/docs/documents.html
 *
 * TUser
 * @param email:string
 * @param password:string
 */

export interface IUser extends TUser, Document {}

const subSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    ref: "Vacancy",
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const userSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  vacancies: {
    type: [subSchema],
    default:[]
  },
});

/**
 * Mongoose Model based on TUser for TypeScript.
 * https://mongoosejs.com/docs/models.html
 *
 * TUser
 * @param firstName:string
 * @param lastName:string
 * @param email:string
 * @param password:string
 */

const User = model<IUser>("User", userSchema);

export default User;
