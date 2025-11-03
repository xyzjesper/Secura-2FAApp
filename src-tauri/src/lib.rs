pub mod commands;

use commands::config::get_app_version;
use commands::security::{blur_password, unblur_password};
use commands::totp::{generate_totp_qr_base64, make_totp};
use std::string::String;
use tauri_plugin_fs::FsExt;
use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "create_initial_tables",
        sql: "CREATE TABLE IF NOT EXISTS accounts (Id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Icon TEXT, Code INT, OtpAuthUrl TEXT);",
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
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
            get_app_version,
            blur_password,
            unblur_password
        ])
        .setup(|_app| {
            #[cfg(mobile)]
            _app.handle().plugin(tauri_plugin_barcode_scanner::init());

            // Setup Secret File
            let scope = _app.fs_scope();
            let _allow_file = scope.allow_file("./secret.txt");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
