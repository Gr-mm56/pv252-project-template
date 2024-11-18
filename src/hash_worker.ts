import { AsyncSha256 } from "./sha-256.js";

// In this file, you can define the worker script that will compute the
// hash digest for a given file. Of course, it is up to you what kind
// of messages should the worker receive/send.

const hasher = new AsyncSha256();
hasher.async_digest(
  "Some data (represented as string)",
  (hash) => console.log(hash),
  (remaining) => console.log(remaining),
);
onmessage = (e) => {
  const reader = new FileReader();
  reader.readAsText(e.data);
  reader.onload = () => {
    const fileData = reader.result as string;
    postMessage({type: 'file_data_total',data: {length: fileData.length}});
    hasher.async_digest(
      fileData,
      (hash) => {
        postMessage({type: 'hash_update', data: {hash: hash, remaining: 0, elapsed: new Date()}});
      },
      (remaining) => {
        postMessage({type: 'remaining_update', data: {remaining: remaining, elapsed: new Date()}});
      }
    )
  };
}
