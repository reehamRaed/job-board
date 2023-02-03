import { Document, model, Schema } from "mongoose";
import Status from "../types/Status";

/**
 * Type to model the User Schema for TypeScript.
 * @param position:string
 * @param description:string
 * @param years_of_experience:string
 * @param status:string
 */

export type TVacancy= {
    position: string;
    description: string;
    years_of_experience:number;
    status:Status
};

/**
 * Mongoose Document based on TUser for TypeScript.
 * https://mongoosejs.com/docs/documents.html
 *
 * TCompany
 * @param name:string
 * @param email:string
 * @param description:string
 */

export interface IVacancy extends TVacancy, Document {}

const vacancySchema: Schema = new Schema({

    position: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    years_of_experience: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

/**
 * Mongoose Model based on TUser for TypeScript.
 * https://mongoosejs.com/docs/models.html
 *
 * TCompany
 * @param name:string
 * @param email:string
 * @param description:string
 */

const Vacancy = model<IVacancy>("Vacancy", vacancySchema);

export default Vacancy;
