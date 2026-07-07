import mongoose from "mongoose";
import { Resolver } from "dns";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/tejomarg-job";

interface MongooseCached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCached | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Programmatic SRV Resolver to bypass local ISP DNS blocking
async function resolveSrvUri(uri: string): Promise<string> {
  if (!uri.startsWith("mongodb+srv://")) {
    return uri;
  }

  // mongodb+srv://username:password@host/dbname?options
  const match = uri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)([^?]*)(.*)$/);
  if (!match) return uri;

  const [_, username, password, host, dbname, query] = match;

  const resolver = new Resolver();
  resolver.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);

  const resolveSrv = (hostname: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      resolver.resolveSrv(`_mongodb._tcp.${hostname}`, (err, addresses) => {
        if (err) reject(err);
        else resolve(addresses);
      });
    });
  };

  const resolveTxt = (hostname: string): Promise<string[][]> => {
    return new Promise((resolve, reject) => {
      resolver.resolveTxt(hostname, (err, records) => {
        if (err) reject(err);
        else resolve(records);
      });
    });
  };

  try {
    const srvRecords = await resolveSrv(host);
    const nodes = srvRecords.map((r) => `${r.name}:${r.port}`).join(",");

    let txtOptions = "";
    try {
      const txtRecords = await resolveTxt(host);
      txtOptions = txtRecords.map((r) => r.join("")).join("&");
    } catch (txtErr) {
      console.warn("[DNS RESOLVE] TXT resolution failed, proceeding without options:", txtErr);
    }

        const dbPath = dbname || "/";
    
    // Deduplicate connection parameters using a Map
    const optionsMap = new Map<string, string>();
    optionsMap.set("ssl", "true");
    optionsMap.set("authSource", "admin");

    const parseParams = (paramStr: string) => {
      const parts = paramStr.split("&");
      for (const part of parts) {
        const [k, v] = part.split("=");
        if (k && v) {
          optionsMap.set(k, v);
        }
      }
    };

    if (txtOptions) parseParams(txtOptions);
    if (query && query.startsWith("?")) parseParams(query.slice(1));

    const finalQuery = Array.from(optionsMap.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join("&");

    const resolved = `mongodb://${username}:${password}@${nodes}${dbPath}?${finalQuery}`;
    console.log("[DNS RESOLVE] Successfully resolved SRV to standard URI connection string");
    return resolved;
  } catch (error) {
    console.error("[DNS RESOLVE] Custom DNS SRV lookup failed, falling back to standard URI:", error);
    return uri;
  }
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = (async () => {
      const connectionString = await resolveSrvUri(MONGODB_URI);
      return mongoose.connect(connectionString, opts);
    })();
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;
