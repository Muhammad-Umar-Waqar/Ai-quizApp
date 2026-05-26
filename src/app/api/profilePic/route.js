import { storage } from '@/lib/appwrite';
import { MongoClient } from 'mongodb';
import User from '@/app/models/User';
const client = new MongoClient(process.env.MONGODB_URI);

export async function POST(req) {
  const formData = await req.formData();
  const userId = formData.get('userId');
  const image = formData.get('image');

  try {
    await client.connect();
    const database = client.db('testapp');
    const users = database.collection('users');

    // Upload image to Appwrite
    const file = await storage.createFile(process.env.BUCKET_ID, userId, image);
    const user = await User.findById(userId); // Ensure you're actually fetching the user
console.log("USER IS ", user);

// Check if profileImageId is null
if (user.profileImageId === null) {
    // If it is null, assign the new file ID
    user.profileImageId = file.$id;
    console.log("File Uploaded Successfully 1");
} else {
    // If it's not null, compare with the existing profileImageId
    if (user.profileImageId.toString() === file.$id) {
        console.log("SAME FILE ALREADY EXISTS");
    } else {
        user.profileImageId = file.$id;
        console.log("File Uploaded Successfully");
    }
}

// Persist the changes back to MongoDB
await users.updateOne(
    { _id: userId },
    { $set: { profileImageId: user.profileImageId } } // Ensure you persist the change
);


    return new Response(JSON.stringify({ success: true, fileId: file.$id }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  } finally {
    await client.close();
  }
}








