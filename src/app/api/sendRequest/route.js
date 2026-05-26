



// sendRequest.js API
import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId, friendId } = await request.json(); // userId = sender, friendId = receiver
    
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    const {name} = user;
    const friendName = name;

    if (!user || !friend) {
      return NextResponse.json({ error: 'User not found' }, { status: 406 });
    }

    // Check if a friend request already exists
    const existingRequest = user.friends.find(
      f => f.friend.toString() === friendId
    );

    console.log("USER REQUEST EXISTS", existingRequest)
    if (existingRequest) {
      if (existingRequest.status === 'Pending') {
        return NextResponse.json({ message: 'Friend request already sent' }, {status: 405});
      }

      if (existingRequest.status === 'rejected') {
        existingRequest.status = 'Pending';
        
        const friendRequestwithReject = friend.friendRequestNotification.find(f => f.sender == userId && f.status == "rejected")
        if (friendRequestwithReject){
          friendRequestwithReject.status = "Pending"
          console.log("Friend Request in Friend Profile Change 1");
          
        }
    
        // friend.friends.push({
        //   friend: userId,
        //   status: 'Pending',
        // });

       const friendFriendsObject =  friend.friends.find(f => f.friend == userId && f.status == "rejected")

        if (friendFriendsObject){
          friendFriendsObject.status = "Pending";
          
          console.log("Friend Request in Friend Profile Change 2");
        }

        await user.save();
        await friend.save();
        return NextResponse.json({ message: 'Friend request re-sent' });
      }

      return NextResponse.json({ message: 'Friend request already processed' });
    }

    // Create new request if none exist
    user.friends.push({
      friend: friendId,
      status: 'Pending', 
    });

    friend.friends.push({
      friend: userId,
      status: 'Pending',
    });

    // Notification for the recipient (User 2)
    friend.friendRequestNotification.push({
      friendName: friendName,
      sender: userId,
      status: 'Pending',
      viewStatus : 'unviewed'      
    });

    await user.save();
    await friend.save();
    
    return NextResponse.json({ message: 'Friend request sent' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return NextResponse.json({ error: 'Failed to send friend request' }, { status: 500 });
  }
}
