import React, { useState } from "react";

const JSONTextArea = () => {
  const [input, setInput] = useState(`
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
    `);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={handleChange}
        rows={10}
        cols={50}
        placeholder="Enter JSON here..."
      />
    </div>
  );
};

export default JSONTextArea;
