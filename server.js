const { default: mongoose } = require("mongoose");
const app = require("./app/app");

const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;

// Connect to the MongoDB database
mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`---- Database connection successfully ----`);

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`---- Server is running on  ${PORT} ----`);
    });
  })
  .catch((err) => {
    console.log("Database connection error:", err);
    process.exit(1); // Exit the application with an error code
  });
