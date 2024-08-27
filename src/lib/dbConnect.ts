//Importting mongoose for database connection
import mongoose from "mongoose";

//Creating the type of the connection object
type ConnectionObject = {
  isConnected?: number;
};

//Initialising the connection object as an empty object
const connection: ConnectionObject = {};

//Function to connect to the database which returns a promise
async function dbConnect(): Promise<void> {
  //Checking if the connection is already established
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }

  //Connecting to the database if the connection is not established
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState; // 1 for connected
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database: ", error);
    process.exit(1);
  }
}

//Exporting the dbConnect function
export default dbConnect;
