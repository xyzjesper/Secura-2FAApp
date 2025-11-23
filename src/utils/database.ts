import Database from "@tauri-apps/plugin-sql";
import { DATABASE_FILE } from "./default";

export async function initDatabaseData(query: string, data?: any[]) {
  const db = await Database.load(`sqlite:${DATABASE_FILE}`);
  // NOT REMOVE!!! - To InIt the database
  await db.execute(
    "CREATE TABLE IF NOT EXISTS accounts (Id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Icon TEXT, OtpAuthUrl TEXT);"
  );
  await db.execute(query, data);
  await db.close();
}

export async function getDatabaseData(query: string, data?: any[]) {
  const db = await Database.load(`sqlite:${DATABASE_FILE}`);

  const result = await db.select(query, data);
  await db.close();
  return result;
}
