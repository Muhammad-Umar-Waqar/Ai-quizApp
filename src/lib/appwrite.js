import { Client, Account, Storage } from 'appwrite';

const client = new Client()
  .setProject(process.env.PROJECT_ID); // Replace with your Appwrite project ID

export const account = new Account(client);
export const storage = new Storage(client);
export default client;
