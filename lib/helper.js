import axios from "axios";

export async function getGeolocation() {
  const { latitude, longitude } = await axios
    .get(
      "http://api.ipstack.com/check?access_key=" +
        process.env.NEXT_PUBLIC_IPSTACK_KEY
    )
    .then((response) => response.data);
  return [latitude, longitude];
}
