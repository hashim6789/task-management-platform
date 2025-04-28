export const env = {
  get SERVER_ORIGIN() {
    return import.meta.env.VITE_SERVER_ORIGIN;
    // // return "http://localhost";
    // return "http://13.232.204.225";
  },
};

console.log(import.meta.env.VITE_SERVER_ORIGIN);
