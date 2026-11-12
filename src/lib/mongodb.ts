import {
  MongoClient,
  Db,
  Collection,
  Document,
  MongoServerSelectionError,
} from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
const MONGODB_DB =
  process.env.MONGODB_DB ||
  (MONGODB_URI ? new URL(MONGODB_URI).pathname.slice(1).split("?")[0] : "") ||
  "xpwot";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let retryConnectionAfter = 0;
let lastConnectionWarningAt = 0;

export function isMongoConfigured(): boolean {
  return Boolean(MONGODB_URI && MONGODB_URI.trim().length > 0);
}

export async function getMongoClient(): Promise<MongoClient | null> {
  if (!isMongoConfigured()) {
    return null;
  }

  const clientOptions = {
    serverSelectionTimeoutMS: process.env.NODE_ENV === "development" ? 5000 : 30000,
  };

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so the MongoClient is preserved across module reloads
    if (!global._mongoClientPromise) {
      client = new MongoClient(MONGODB_URI!, clientOptions);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    // In production mode, avoid global variable
    if (!clientPromise) {
      client = new MongoClient(MONGODB_URI!, clientOptions);
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

export async function getOrdersCollection(): Promise<Collection<Document> | null> {
  if (process.env.NODE_ENV === "development" && Date.now() < retryConnectionAfter) {
    return null;
  }

  try {
    const db = await getMongoDb();
    if (!db) return null;
    retryConnectionAfter = 0;
    return db.collection("orders");
  } catch (error) {
    if (process.env.NODE_ENV !== "development" || !(error instanceof MongoServerSelectionError)) {
      throw error;
    }

    global._mongoClientPromise = undefined;
    client = null;
    clientPromise = null;
    retryConnectionAfter = Date.now() + 30000;

    if (Date.now() - lastConnectionWarningAt >= 30000) {
      console.warn(
        "MongoDB is unreachable in development; using .data/orders.json temporarily. Check Atlas IP access, firewall access to port 27017, and the connection string."
      );
      lastConnectionWarningAt = Date.now();
    }

    return null;
  }
}
