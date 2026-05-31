import mongoose from "mongoose";

export const connectDB = async () => {
   try {
      mongoose.connection.on("connected", () => {
         console.log("Database connected successfully");
      });

      let mongodbURI = process.env.MONGODB_URI

      await mongoose.connect(`${mongodbURI}/ResuMate`);

   } catch (error) {
      console.error("Error connecting to the database:", error);
   }
}   
