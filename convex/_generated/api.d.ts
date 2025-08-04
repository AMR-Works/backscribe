/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as analytics from "../analytics.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export const api = {
  analytics: {
    logGeneration: null as any,
    getUserGenerations: null as any,
    getTotalUsers: null as any,
    getPaidUsers: null as any,
  },
  users: {
    getOrCreateUser: null as any,
    updateUserSubscription: null as any,
    incrementImageGeneration: null as any,
    resetMonthlyUsage: null as any,
  },
} as any;

export default api;