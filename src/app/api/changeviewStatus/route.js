import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {
        const { userId } = await req.json();
        
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: "Failed to Change the view Status!" }, { status: 400 });
        }

        // Update each notification's viewStatus to "viewed"
        user.friendRequestNotification.forEach((notification) => {
            if (notification.viewStatus === "unviewed") {
                notification.viewStatus = "viewed";
            }
        });

        await user.save(); // Save the updated user document

        return NextResponse.json({ message: "Changed Friend Request to Viewed" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to Change the view Status!" }, { status: 500 });
    }
}
