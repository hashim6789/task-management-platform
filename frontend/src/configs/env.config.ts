export const env = {
  get SERVER_ORIGIN() {
    // return import.meta.env.VITE_SERVER_ORIGIN;
    // return "http://localhost";
    return "http://3.111.41.75";
  },
};

console.log(import.meta.env.VITE_SERVER_ORIGIN);
