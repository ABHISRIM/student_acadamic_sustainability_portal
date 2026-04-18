import React, { useState } from "react";
import API from "../Services/authService";

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/issues", formData);
      alert("Issue Submitted Successfully ✅");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Error submitting issue ❌");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Submit Sustainability Issue</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Issue Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="category"
          placeholder="Category (Water, Waste, Energy...)"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <br /><br />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
}
