import { MongoClient, Db, Collection } from "mongodb";
import { OrderRecord } from "@/types/order";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "xpwot";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoConfigured(): boolean {
  return Boolean(MONGODB_URI && MONGODB_URI.trim().length > 0);
}

export async function getMongoClient(): Promise<MongoClient | null> {
  if (!isMongoConfigured()) {
    return null;
  }

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so the MongoClient is preserved across module reloads
    if (!global._mongoClientPromise) {
      client = new MongoClient(MONGODB_URI!);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    // In production mode, avoid global variable
    if (!clientPromise) {
      client = new MongoClient(MONGODB_URI!);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

export async function getMongoDb(): Promise<Db | null> {
  const mongoClient = await getMongoClient();
  if (!mongoClient) return null;
  return mongoClient.db(MONGODB_DB);
}

let indexesEnsured = false;

export async function getOrdersCollection(): Promise<Collection<OrderRecord> | null> {
  const db = await getMongoDb();
  if (!db) return null;

  const collection = db.collection<OrderRecord>("orders");

  if (!indexesEnsured) {
    try {
      // Ensure unique index on razorpay_order_id
      await collection.createIndex({ razorpay_order_id: 1 }, { unique: true });
      // Ensure unique index on razorpay_payment_id (sparse: only when payment_id exists)
      await collection.createIndex(
        { razorpay_payment_id: 1 },
        { unique: true, sparse: true }
      );
      // Index for created_at lookup
      await collection.createIndex({ created_at: -1 });
      indexesEnsured = true;
    } catch (err) {
      console.error("MongoDB index initialization error:", err);
    }
  }

  return collection;
}

