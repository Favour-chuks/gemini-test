import { useState } from "react";


export default function App() {
  const [image, setImage] = useState(null);
  // const [chatResponse, setChatResponse] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const supriseOptions = [
    "what is in this image?",
    "can you calculate the number of pexels that this image have? you can either answer with yes or no",
    "what do you notice about this picture?",
  ];

  const suprise = () => {
    const randomValue =
      supriseOptions[Math.floor(Math.random() * supriseOptions.length)];
    setValue(randomValue);
  };

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
      const response = await fetch("http://localhost:5000/file", options);
      const data = response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const analyseImage = async () => {
    if (!image) {
      setError("sorry you havnt selected an image");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({ message: value }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:5000/gemini", options);
      console.log(response);
    } catch (error: any) {
      setError(error);
    }
  };

  const pushContent = async () => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:5000/storage", options);
      console.log(response);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const getData =  async () => {
    // const options = {
    //   method : 'GET',
    //   url: 'http://localhost:5000/get'
    // }
    // axios.request(options).then((response) => {
    //   console.log(response.data);
    //   setGetResponse(response.data)
    // })

    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:5000/storage", options);
      console.log(response);
    } catch (error: any) {
      console.log(error.message);
    }

  };
  return (
    <div className="bg-slate-200 p-10">
      <button onClick={pushContent}>push to database</button>
      <button onClick={getData}>get database</button>
    
      <div className="flex flex-row justify-between">
        <div id="image-preview">
          {image && (
            <img
              src={URL.createObjectURL(image)}
              className="h-[100px] w-[100px]"
            />
          )}
        </div>
        <label
          htmlFor="file"
          className="border border-1 border-gray-700 py-[5px] min-w-[50%] min-h-[100px] grid place-items-center hover:border-blue-700 hover:text-blue-700">
          upload image
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={uploadImage}
            hidden
          />
        </label>
      </div>

      <div className="flex justify-between my-5">
        <p>what do you want to know about this image?</p>
        <button
          onClick={suprise}
          className="border border-1 border-gray-700 px-3 hover:border-blue-700 hover:text-blue-700">
          suprise me
        </button>
      </div>

      <div className="flex justify-between">
        <input
          type="text"
          value={value}
          placeholder="what is in the image"
          onChange={(e) => {
            setValue(e.target.value);
          }}
          className="w-[60%]"
        />
        <button
          onClick={analyseImage}
          className="border border-1 border-gray-700 px-3 hover:border-blue-700 hover:text-blue-700">
          analyse image
        </button>
      </div>

      <section className="h-30 w-[100%] overflow-scroll overflow-x-hidden">
        {/* {chatResponse && <p>{chatResponse}</p>} */}
        {error && <p>{error}</p>}
      </section>
    </div>
  );
}
