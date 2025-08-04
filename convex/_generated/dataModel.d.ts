/* eslint-disable */
/**
 * Generated `dataModel` utilities.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import { AnyDataModel } from "convex/server";
import type { GenericId } from "convex/values";

/**
 * The Convex data model based on your schema.
 */
export interface DataModel {
  users: {
    document: {
      _id: GenericId<"users">;
      _creationTime: number;
      userId: string;
      email: string;
      paid: boolean;
      subscriptionId?: string;
      imagesGenerated: number;
      lastResetAt: string;
    };
    fieldPaths:
      | "_id"
      | "_creationTime"
      | "userId"
      | "email"
      | "paid"
      | "subscriptionId"
      | "imagesGenerated"
      | "lastResetAt";
    indexes: {
      by_user_id: {
        userId: string;
      };
      by_email: {
        email: string;
      };
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  generations: {
    document: {
      _id: GenericId<"generations">;
      _creationTime: number;
      userId: string;
      imageUrl?: string;
      textContent: string;
      generatedAt: string;
    };
    fieldPaths:
      | "_id"
      | "_creationTime"
      | "userId"
      | "imageUrl"
      | "textContent"
      | "generatedAt";
    indexes: {
      by_user_id: {
        userId: string;
      };
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
}

/**
 * The type of a document stored in this table.
 */
export type Doc<TableName extends keyof DataModel> = DataModel[TableName]["document"];

/**
 * An identifier for a document in a given table.
 */
export type Id<TableName extends keyof DataModel> = DataModel[TableName]["document"]["_id"];