import {z} from "zod";

export const productSearchSchema=z.object({
  query:z.string().min(2).max(200),
  category:z.string().max(100).optional(),
  location:z.object({postalCode:z.string().max(20).optional()}).optional()
});

export const visualizationSchema=z.object({
  projectId:z.string().uuid(),
  sourcePhotoUrl:z.string().url(),
  spaceType:z.string().min(1).max(100),
  styleNotes:z.string().max(2000).optional().default(""),
  products:z.array(z.object({
    productId:z.string().min(1),
    name:z.string().min(1),
    brand:z.string().optional(),
    model:z.string().optional(),
    sku:z.string().optional(),
    color:z.string().optional(),
    finish:z.string().optional(),
    size:z.string().optional(),
    retailerName:z.string().optional(),
    retailerUrl:z.string().optional()
  })).min(1)
});

export const availabilitySchema=z.object({
  productIds:z.array(z.string().min(1)).min(1).max(100)
});

export const purchaseListSchema=z.object({
  projectId:z.string().uuid(),
  designId:z.string().min(1),
  items:z.array(z.object({
    productId:z.string().min(1),
    name:z.string().min(1),
    quantity:z.number().nonnegative(),
    unit:z.string().optional(),
    price:z.number().nullable().optional(),
    retailerName:z.string().optional(),
    retailerUrl:z.string().optional()
  })).min(1)
});

export const roofMeasureSchema=z.object({
  projectId:z.string().uuid(),
  latitude:z.number().min(-90).max(90),
  longitude:z.number().min(-180).max(180),
  requiredQuality:z.enum(["BASE","MEDIUM","HIGH"]).optional().default("BASE")
});

export const roofGeometrySchema=z.object({
  projectId:z.string().uuid(),
  latitude:z.number().min(-90).max(90),
  longitude:z.number().min(-180).max(180),
  address:z.string().max(500).optional()
});
