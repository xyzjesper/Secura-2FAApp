use serde_json::{json, Value};
use tauri_plugin_sql::{Migration, MigrationKind};
use totp_rs::TOTP;
#[tauri::command]
fn make_totp_qrcode(oauth: &str) -> Value {
    let totp = TOTP::from_url(oauth).unwrap();
    let token = totp.generate_current().unwrap();

    return json!(
        {
            "success": true,
            "token": token.to_string(),
            "message": "Created successfully"
        }
    );
}

#[tauri::command]
fn make_totp_manual() -> Value {
    return json!(
        {
            "success": false,
            "message": "Not Implemented",

        }
    );
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE IF NOT EXISTS accounts (Id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Icon TEXT, Code INT, OtpAuthUrl TEXT);",
            kind: MigrationKind::Up,
        }
    ];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:SecuraDB4.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![make_totp_manual, make_totp_qrcode])
        .setup(|app| {
            #[cfg(mobile)]
            app.handle().plugin(tauri_plugin_barcode_scanner::init());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
