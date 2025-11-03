use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use base64::prelude::BASE64_STANDARD;
use base64::Engine;

#[tauri::command]
pub fn blur_password(password: String, key: String) -> Result<String, String> {
    let key_bytes = key.as_bytes();
    let cipher = Aes256Gcm::new_from_slice(&key_bytes[0..32]).map_err(|e| e.to_string())?;
    let nonce = Nonce::from_slice(&[0u8; 12]);
    let encrypted = cipher
        .encrypt(nonce, password.as_bytes())
        .map_err(|e| e.to_string())?;
    Ok(BASE64_STANDARD.encode(encrypted))
}

#[tauri::command]
pub fn unblur_password(blurred: String, key: String) -> Result<String, String> {
    let key_bytes: &[u8] = key.as_bytes();
    let cipher = Aes256Gcm::new_from_slice(&key_bytes[0..32]).map_err(|e| e.to_string())?;
    let nonce = Nonce::from_slice(&[0u8; 12]);
    let decoded = BASE64_STANDARD.decode(blurred).map_err(|e| e.to_string())?;
    let decrypted = cipher
        .decrypt(nonce, decoded.as_ref())
        .map_err(|e| e.to_string())?;
    Ok(String::from_utf8(decrypted).map_err(|e| e.to_string())?)
}
