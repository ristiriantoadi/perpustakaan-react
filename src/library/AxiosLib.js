import Axios from 'axios';

export async function getData(url, token) {
  const response = await Axios.get(url, {
    headers: {
      token,
    },
  });
  return response;
}

export async function postData(url, data, token) {
  const response = await Axios.post(url, data, {
    headers: {
      token,
    },
  });
  return response;
}

export async function patchData(url, data, token) {
  const response = await Axios.patch(url, data, {
    headers: {
      token,
    },
  });
  return response;
}

export async function deleteData(url, token) {
  const response = await Axios.delete(url, {
    headers: {
      token,
    },
  });
  return response;
}
