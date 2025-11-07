
/**
 * Encodes a Uint8Array of audio bytes into a Base64 string.
 * This is necessary for sending raw audio data over the WebSocket connection
 * to the Gemini Live API.
 * @param bytes The raw audio data.
 * @returns A Base64 encoded string.
 */
export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes a Base64 string back into a Uint8Array of audio bytes.
 * This would be used if you wanted to process the audio response from Gemini.
 * NOTE: This app focuses on transcription, so this function is provided for completeness
 * but is not actively used in the current implementation.
 * @param base64 The Base64 encoded audio string.
 * @returns A Uint8Array of raw audio data.
 */
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
