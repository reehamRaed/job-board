import { Document, model, Schema } from "mongoose";

/**
 * Type to model the User Schema for TypeScript.
 * @param firstName:string
 * @param lastName:string
 * @param email:string
 * @param password:string
 */

export type TCompany = {
    name: string;
    email: string;
    description: string;
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

export interface ICompany extends TCompany, Document {}

const companySchema: Schema = new Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
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

const Company = model<ICompany>("Company", companySchema);

export default Company;
