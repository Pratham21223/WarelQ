import Tesseract from 'tesseract.js';

export async function recognizeText(file, onProgress) {
  const result = await Tesseract.recognize(
    file,
    'eng',
    {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          onProgress(Math.round(m.progress * 100));
        }
      }
    }
  );
  
  return result.data.text;
}
