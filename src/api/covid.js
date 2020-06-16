import axios from ".";

export const covidDataAPI = () => {
  return axios({
    method: "GET",
    url: `/key-value-stores/toDWvRj1JpTXiM8FF/records/LATEST`,
  });
};
