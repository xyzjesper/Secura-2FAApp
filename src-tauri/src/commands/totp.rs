use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::time::{SystemTime, UNIX_EPOCH};
use totp_rs::TOTP;

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenResponse {
    pub success: bool,
    pub token: String,
    pub nexttoken: String,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenError {
    pub status: bool,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct QRCodeResponse {
    pub success: bool,
    pub qrcodebase64: String,
}

#[tauri::command]
pub fn make_totp(oauth: &str) -> Result<TokenResponse, TokenError> {
    let totp = TOTP::from_url(oauth).unwrap();

    let token = totp
        .generate_current()
        .map_err(|e| {
            TokenError {
                status: false,
                message: format!("Failed to generate TOTP token: {}", e.to_string()),
            };
        })
        .unwrap();
    let start = SystemTime::now();
    let since_the_epoch = start
        .duration_since(UNIX_EPOCH)
        .expect("time should go forward");
    let seconds = since_the_epoch.as_secs() + 30;

    let next_token = totp.generate(seconds);

    Ok(TokenResponse {
        success: true,
        token,
        nexttoken: next_token.to_string(),
        message: "Created successfully".to_string(),
    })
}

#[tauri::command]
pub fn generate_totp_qr_base64(oauth: &str) -> Result<QRCodeResponse, QRCodeResponse> {
    let totp = TOTP::from_url(oauth).unwrap();
    let qr_code = totp.get_qr_base64().unwrap();

    Ok(QRCodeResponse {
        success: true,
        qrcodebase64: qr_code,
    })
}
