import axios from "axios";
import { useState } from "react";
import ColorCircle from "./components/colorCircle";
export default function Frontend() {
  const [image, setImage] = useState(null);
  const [colors, setColors] = useState([]);
  const uploadImage = async (e: any) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    setImage(e.target.files[0]);
    e.target.value = null;
    try {
      const options = {
        method: "POST",
        body: formData,
      };
      const response = await fetch("http://localhost:3000/file", options);
      const data = response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getImageColors = async () => {
    const options = {
      method: "GET",
      url: "http://localhost:3000/colors",
    };
    axios
      .request(options)
      .then((response) => {
        setColors(response.data);
        console.log(colors);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <>
      <div className="w-[300px] h-[350px] bg-slate-200 flex flex-col">
        <label
          htmlFor="image"
          className="w-full h-[80%] hover:text-blue-500 flex items-center justify-center hover:border hover:border-blue-500">
          upload image
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={uploadImage}
            hidden
          />
        </label>

        <button
          onClick={getImageColors}
          className="mt-3 border border-1 border-blue-500 hover:bg-blue-500 hover:text-stone-50">
          get image colors
        </button>

        {colors
          ? colors.map((colorhex: any) => <ColorCircle color={colorhex} />)
          : null}
      </div>
    </>
  );
}
