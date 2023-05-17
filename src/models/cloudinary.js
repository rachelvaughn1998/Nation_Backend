import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: "dg4jye9k4",
  api_key: "763628149477897",
  api_secret: "V6ykTSqs7VPwU03gVEPyQDJhdfw",
});

const uploadToCloudinary = (path, folder) => {
  return cloudinary.uploader
    .upload(path, {
      folder,
    })
    .then((data) => {
      return { url: data.url, public_id: data.public_id };
    })
    .catch((error) => {
      console.log(error);
    });
};

export default uploadToCloudinary;
