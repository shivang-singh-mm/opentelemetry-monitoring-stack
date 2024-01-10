import http from 'k6/http';
import { check, sleep } from "k6";

const isNumeric = (value) => /^\d+$/.test(value);

const default_vus = 5;

const target_vus_env = `${__ENV.TARGET_VUS}`;
const target_vus = isNumeric(target_vus_env) ? Number(target_vus_env) : default_vus;

export let options = {
  stages: [
      // Ramp-up from 1 to TARGET_VUS virtual users (VUs) in 5s
      { duration: "10s", target: target_vus },

      // Stay at rest on TARGET_VUS VUs for 10s
      { duration: "30s", target: target_vus },

      // Ramp-down from TARGET_VUS to 0 VUs for 5s
      { duration: "10s", target: 0 }
  ]
};



export default function () {
  const url1 = 'http://app:6983/collections/list/3';
  var payload = JSON.stringify({
        limit:2,
        token:"0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
        index:"3177"
  });



  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const result = http.get(url1, payload, params);
  // console.log(result.json())
  const data = result.json();
  // console.log(data.rows[0].collection_id)
  const url2 = `http://app:6983/collections/details/${data.rows[Math.floor(Math.random()*10)].collection_id}`
  http.get(url2,payload,params)
  const url3 = `http://app:6983/collections/enable`
  payload = JSON.stringify({
    "collectionUuids": [`${data.rows[Math.floor(Math.random()*10)].collection_id}`]
  })
  http.post(url3,payload,params)
}



// Kfka-connect
// Zookeeper
// broker
// lag exporter metrics