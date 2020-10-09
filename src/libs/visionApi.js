import axios from 'axios';

const apiKey = process.env.VUE_APP_API_KEY;
const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default async function getCloudVisionResult(file, maxResults = 10) {
  let imageBase64 = null;
  try {
    imageBase64 = await toBase64(file);
    imageBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
  } catch (error) {
    console.log(error);
    return null;
  }

  const options = {
    requests: [
      {
        image: {
          content: imageBase64,
        },
        features: [
          {
            type: 'TEXT_DETECTION',
            maxResults,
          },
        ],
      },
    ],
  };
  try {
    const response = await axios.post(visionApiUrl, options);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
