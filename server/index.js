const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());



mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/auth", authRoutes);
app.use("/upload", uploadRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
