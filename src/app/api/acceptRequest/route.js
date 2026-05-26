// acceptRequest.js API
import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function PATCH(request) {
  try {
    const { userId, friendId } = await request.json(); // userId = recipient, friendId = requester
  
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
  
    if (!user || !friend) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  
    // Find the friend request in the recipient's (User 2) friends array
    const friendRequest = user.friends.find(
      f => f.friend.toString() === friendId && f.status === 'Pending'
    );
  
    if (!friendRequest) {
      return NextResponse.json({ error: 'Friend request not found' }, { status: 404 });
    }

    // Update the request status to 'Accepted'
    friendRequest.status = 'Accepted';
    
    // Update the requester's (User 1) friends list as well
    const friendRequestInSender = friend.friends.find(
      f => f.friend.toString() === userId && f.status === 'Pending'
    );
    
    if (friendRequestInSender) {
      friendRequestInSender.status = 'Accepted';
    }


    const friendRequestRejectedtoPending = friend.friendRequestNotification.find(f => f.sender == userId && f.status == "rejected")

    if(friendRequestRejectedtoPending){
      friendRequestRejectedtoPending.status = "Accepted";
    }
    

    const friendrequestNotification = user.friendRequestNotification.find(
      f => f.sender.toString() === friendId
    );

    
    if (friendrequestNotification) {
      friendrequestNotification.status = "Accepted"
    }
    if (!friendrequestNotification) {
      return NextResponse.json({ error: 'Friend Request notification is unavailable' }, { status: 404 });
    }

    // Save both users to enable quiz sharing
    await user.save();
    await friend.save();
  
    return NextResponse.json({ message: 'Friend request accepted' }, {status: 200});
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return NextResponse.json({ error: 'Failed to accept friend request' }, { status: 500 });
  }
}
