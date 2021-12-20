import axios from "axios";

const apiCall = async (url) => {
  console.log("🚀 ~ file: index.js ~ line 4 ~ apiCall FETCHNIG ~ url", url)
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log("🚀 ~ file: index.js ~ line 7 ~ apiCall ~ error", error)
    return []
  }
}

export default apiCall