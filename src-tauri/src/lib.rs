use serde_json::{json, Value};
use tauri::webview::cookie::time::{Time};
use std::string::String;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::AppHandle;
use tauri_plugin_sql::{Migration, MigrationKind};
use totp_rs::TOTP;

#[tauri::command]
fn make_totp(oauth: &str) -> Value {
    let totp = TOTP::from_url(oauth).unwrap();
    let token = totp.generate_current().unwrap();

    let start = SystemTime::now();
    let since_the_epoch = start
        .duration_since(UNIX_EPOCH)
        .expect("time should go forward");
    let seconds = since_the_epoch.as_secs() + 30;

    let next_token = totp.generate(seconds);

    return json!(
        {
            "success": true,
            "token": token.to_string(),
            "nextToken": next_token.to_string(),
            "message": "Created successfully"
        }
    );
}

#[tauri::command]
fn generate_totp_qr_base64(oauth: &str) -> Value {
    let totp = TOTP::from_url(oauth).unwrap();
    let qr_code = totp.get_qr_base64().unwrap();

    return json!(
        {
            "success": true,
            "qrCodeBase64": qr_code
        }
    );
}

#[tauri::command]
fn get_app_version(app_handle: AppHandle) -> String {
    return app_handle.package_info().version.to_string();
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
        .plugin(tauri_plugin_os::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:SecuraDB4.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            make_totp,
            generate_totp_qr_base64,
            get_app_version
        ])
        .setup(|_app| {
            #[cfg(mobile)]
            _app.handle().plugin(tauri_plugin_barcode_scanner::init());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
