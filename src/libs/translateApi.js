import axios from 'axios';

const apiKey = process.env.VUE_APP_API_KEY;

export default async function getTranslate(text, lang) {
  const q = text;
  const target = lang;
  const translateApiUrl = `https://translation.googleapis.com/language/translate/v2/?target=${target}&key=${apiKey}&q=${q}`;
  try {
    const response = await axios.post(translateApiUrl);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
