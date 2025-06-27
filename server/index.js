const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const insightsRoutes = require("./routes/insights");

const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: "https://incomparable-babka-ac3971.netlify.app/",
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/auth", authRoutes);
app.use("/upload", uploadRoutes);
app.use("/insights", insightsRoutes);




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
