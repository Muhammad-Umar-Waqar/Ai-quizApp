// getProfilPicimport { storage } from '@/lib/appwrite';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function GET(req, { params }) {
  const { id } = params;

  try {
    await client.connect();
    const database = client.db('testapp');
    const users = database.collection('users');

    const user = await users.findOne({ _id: id });
    if (!user) return new Response("User not found", { status: 404 });

    // Fetch image URL from Appwrite
    const imageUrl = storage.getFilePreview(process.env.BUCKET_ID, user.profileImageId);

    return new Response(JSON.stringify({ ...user, imageUrl }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    await client.close();
  }
}


