// export const URL = "http://localhost:5000";
export const URL = "https://amazon-minified-node-js.onrender.com";

export const createConfigObj = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};
