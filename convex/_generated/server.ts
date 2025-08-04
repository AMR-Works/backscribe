/* eslint-disable */
/**
 * Generated `server` utilities.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import {
  internalActionGeneric,
  internalMutationGeneric,
  internalQueryGeneric,
  actionGeneric,
  httpActionGeneric,
  mutationGeneric,
  queryGeneric,
} from "convex/server";
import type { DataModel } from "./dataModel.js";

/**
 * Define a query in this Convex app's public API.
 */
export const query = queryGeneric as any;

/**
 * Define a mutation in this Convex app's public API.
 */
export const mutation = mutationGeneric as any;

/**
 * Define an action in this Convex app's public API.
 */
export const action = actionGeneric as any;

/**
 * Define an HTTP action in this Convex app's public API.
 */
export const httpAction = httpActionGeneric as any;

/**
 * Define an internal query to call from other functions inside this Convex app.
 */
export const internalQuery = internalQueryGeneric as any;

/**
 * Define an internal mutation to call from other functions inside this Convex app.
 */
export const internalMutation = internalMutationGeneric as any;

/**
 * Define an internal action to call from other functions inside this Convex app.
 */
export const internalAction = internalActionGeneric as any;