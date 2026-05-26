

// rejectRequest.js API
import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function PATCH(request) {
  try {
    const { userId, friendId } = await request.json(); // userId = recipient, friendId = requester

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return NextResponse.json({ error: 'User or friend not found' }, { status: 404 });
    }

    // Find the friend request in the recipient's (User 2) friends array
    const friendRequest = user.friends.find(
      f => f.friend.toString() === friendId
    );

    if (!friendRequest) {
      return NextResponse.json({ message: 'Friend request not found' }, { status: 404 });
    }

    if (friendRequest.status === "rejected") {
      return NextResponse.json({ message: 'You have already rejected this request' }, { status: 400 });
    }

    // Update the status to 'rejected'
    friendRequest.status = 'rejected';

    // Update the status in the requester's (User 1) friends list
    const friendRequestInSender = friend.friends.find(
      f => f.friend.toString() === userId
    );

    if (friendRequestInSender) {
      friendRequestInSender.status = 'rejected';
    }

    // Update notification statuses
    const userNotification = user.friendRequestNotification.find(
      notification => notification.sender.toString() === friendId
    );
    const friendNotification = friend.friendRequestNotification.find(
      notification => notification.sender.toString() === userId
    );

    if (userNotification) {
      userNotification.status = 'rejected';
    } else {
      user.friendRequestNotification.push({
        sender: friendId,
        status: 'rejected'
      });
    }

    if (friendNotification) {
      friendNotification.status = 'rejected';
    } else {
      friend.friendRequestNotification.push({
        sender: userId,
        status: 'rejected'
      });
    }

    await user.save();
    await friend.save();

    return NextResponse.json({ message: 'Friend request rejected' });
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    return NextResponse.json({ error: 'Failed to reject friend request' }, { status: 500 });
  }
}
