import {
  Customer,
  PaginatedResponse,
  Region,
  // PaginatedResponse,
  // Product,
  authenticate,
  // defaultAdminProductFields,
  // defaultAdminProductRelations,
  transformBody,
  transformQuery,
  // transformQuery,
  wrapHandler,
} from "@medusajs/medusa";
// import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import cors from "cors";
import { Router } from "express";
import { parseCorsOrigins } from "medusa-core-utils";
// import { Bundle } from "../../../../models/bundle";
// import { AdminPostProductsToBundleReq } from "./add-products";
import { AdminPostStoreCreditsReq } from "./create-store-credit";
import { AdminGetStoreCreditsParams } from "./list-store-credits";
// import { AdminGetBundlesBundleProductsParams } from "./list-products";
// import { AdminDeleteProductsFromBundleReq } from "./remove-products";
import { StoreCredit } from "../../../../models/store-credit";
import { AdminGetStoreCreditsCustomersParams } from "./list-customers";
import { AdminPostStoreCreditsStoreCreditReq } from "./update-store-credit";

export default function adminRoutes(router: Router, admin_cors: string) {
  const adminRouter = Router();

  router.use("/admin/store-credits", adminRouter);

  adminRouter.use(
    cors({
      origin: parseCorsOrigins(admin_cors),
      credentials: true,
    })
  );
  adminRouter.use(authenticate());

  adminRouter.get(
    "/",
    transformQuery(AdminGetStoreCreditsParams, {
      isList: true,
    }),
    wrapHandler(require("./list-store-credits").default)
  );

  adminRouter.post(
    "/",
    transformBody(AdminPostStoreCreditsReq),
    wrapHandler(require("./create-store-credit").default)
  );

  adminRouter.post(
    "/:id",
    transformBody(AdminPostStoreCreditsStoreCreditReq),
    wrapHandler(require("./update-store-credit").default)
  );

  adminRouter.get(
    "/customers",
    transformQuery(AdminGetStoreCreditsCustomersParams, {
      isList: true,
    }),
    wrapHandler(require("./list-customers").default)
  );

  adminRouter.get(
    "/customers/:id",
    transformQuery(AdminGetStoreCreditsCustomersCustomerParams, {
      isList: false,
    }),
    wrapHandler(require("./get-customer").default)
  );

  adminRouter.get(
    "/customers/:id/store-credits",
    transformQuery(AdminGetStoreCreditsCustomersCustomerStoreCreditsParams, {
      isList: true,
      defaultRelations: ["region"],
    }),
    wrapHandler(require("./list-customer-store-credits").default)
  );

  adminRouter.delete(
    "/:id",
    wrapHandler(require("./delete-store-credit").default)
  );

  // adminRouter.post(
  //   "/:id/products/batch",
  //   transformBody(AdminPostProductsToBundleReq),
  //   wrapHandler(require("./add-products").default)
  // );

  // adminRouter.get(
  //   "/:id/products",
  //   transformQuery(AdminGetBundlesBundleProductsParams, {
  //     defaultRelations: defaultAdminProductRelations,
  //     defaultFields: defaultAdminProductFields,
  //     isList: true,
  //   }),
  //   wrapHandler(require("./list-products").default)
  // );

  // adminRouter.delete(
  //   "/:id/products/batch",
  //   transformBody(AdminDeleteProductsFromBundleReq),
  //   wrapHandler(require("./remove-products").default)
  // );
}

/**
 * @schema AdminStoreCreditsRes
 * type: object
 * x-expanded-relations:
 *   field: store_credit
 *   relations:
 *     - customer
 *     - region
 * required:
 *   - store_credit
 * properties:
 *   store_credit:
 *     description: Store Credit details.
 *     $ref: "#/components/schemas/StoreCredit"
 */
export type AdminStoreCreditsRes = {
  store_credit: StoreCredit;
};

/**
 * @schema AdminStoreCreditsDeleteRes
 * type: object
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted Store Credit.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: store_credit
 *   deleted:
 *     type: boolean
 *     description: Whether or not the items were deleted.
 *     default: true
 */
export type AdminStoreCreditsDeleteRes = {
  id: string;
  object: "store_credit";
  deleted: boolean;
};

/**
 * @schema AdminStoreCreditsListRes
 * type: object
 * x-expanded-relations:
 *   field: store_credits
 *   relations:
 *     - customer
 *     - region
 * required:
 *   - store_credits
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   store_credits:
 *     type: array
 *     description: An array of Store Credit details.
 *     items:
 *       $ref: "#/components/schemas/StoreCredit"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of store credits skipped.
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminStoreCreditsListRes = PaginatedResponse & {
  store_credits: StoreCredit[];
};

/**
 * @schema AdminStoreCreditsCustomersListRes
 * type: object
 * x-expanded-relations:
 *   field: customers
 *   relations:
 *     - customer
 *     - region
 * required:
 *   - customers
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   customers:
 *     type: array
 *     description: An array of Store Credit Customer details.
 *     items:
 *       $ref: "#/components/schemas/StoreCreditCustomer"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of store credits skipped.
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminStoreCreditsCustomersListRes = PaginatedResponse & {
  store_credits: StoreCredit[];
  customers: {
    customer: Customer;
    region: Region;
    amount: number;
    balance: number;
  }[];
};

/**
 * @schema StoreCreditCustomer
 * title: "StoreCreditCustomer"
 * description: "Store credit customer."
 * type: object
 * required:
 *   - customer
 *   - region
 *   - amount
 *   - balance
 * properties:
 *   customer:
 *     description: The details of the customer associated with the store credit.
 *     x-expandable: "customer"
 *     nullable: true
 *     $ref: "#/components/schemas/Customer"
 *   region:
 *     description: The details of the region this store credit was created in.
 *     x-expandable: "region"
 *     nullable: true
 *     $ref: "#/components/schemas/Region"
 *   value:
 *     description: Original store credit value.
 *     type: number
 *     example: 1000
 *   balance:
 *     description: Current store credit value.
 *     type: number
 *     example: 500
 */
