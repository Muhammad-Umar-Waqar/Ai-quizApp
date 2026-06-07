
'use client'

import userContext from "@/context/userDetails/UserContext"
import { FormControl, IconButton, InputLabel, Menu, MenuItem, Select } from "@mui/material"
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react"
import Link from "next/link"
import { useContext, createContext, useState, useEffect } from "react"
import { MoreVerticalIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import withAuth from "../../helpers/withAuth"
import { toast } from "react-toastify"
import { getCookie, deleteCookie } from "../../helpers/cookieUtils"


const SidebarContext = createContext()

function DashboardLayout({ children }) {
  const [expanded, setExpanded] = useState(true)
  const context = useContext(userContext)
  const {user} = context;
  const { unreadCount } = context;
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const {updateUnreadCount } = context;
  const myID = user?._id;
  const current_notifications = user?.notifications;
  const {updateUnreadFriendRequestNotifications} = context;
  const {unreadFriendRequests} = context;


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

const router = useRouter();
  async function handleLogout() {
    setLoading(true)
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
        });

        deleteCookie('token');
        deleteCookie('userId');
        localStorage.removeItem('notificationId');

        // Refresh user context to clear user data
        if (updateUnreadCount) {
          updateUnreadCount(0);
        }
        if (updateUnreadFriendRequestNotifications) {
          updateUnreadFriendRequestNotifications(0);
        }

        if (response.ok) {
            router.push('/signup');
        } else {
            console.error('Failed to log out');
        }
    } catch (error) {
        console.error('Error during logout:', error);
    } finally {
      setLoading(false);
    }
}





useEffect(() => {
  const fetchNotifications = async () => {
      try {
          if (myID) {
              const response = await fetch(`/api/notifications?userId=${myID}`);
              if (!response.ok) {
                  throw new Error('Failed to fetch notifications');
              }
              const data = await response.json();
       

              const unreadNotifications = data.filter(n => n.status === 'Pending');
              // setUnreadCount(unreadNotifications.length);
              updateUnreadCount(unreadNotifications.length);
          }

      } catch (error) {
          console.error('Error fetching notifications:', error);
      } finally {
          setLoading(false);
      }
  };

  fetchNotifications();
}, [myID, current_notifications, updateUnreadCount]);


  useEffect(() => {
    const token = getCookie('token');
    if (!token) return;

    const fetchFriends = async () => {
      try {
        const res = await fetch('/api/friends', {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const friendRequestNotifications = await res.json();

        if (!friendRequestNotifications) {
          toast.error("Friends Not Found!");
        }

        console.log("Friend Request Notifications Are", friendRequestNotifications);
        const unreadFriendReqNotifications = friendRequestNotifications.filter(n => n.viewStatus === 'unviewed');
        if (unreadFriendReqNotifications.length > 0) {
          updateUnreadFriendRequestNotifications(unreadFriendReqNotifications.length);
        }

      } catch (error) {
        toast.error(error)
      }
    }
    fetchFriends();
  }, [updateUnreadFriendRequestNotifications])




  return (
    <div className="flex min-h-screen  bg-white">
      <aside className={`${expanded ? "md:w-64" : "md:w-30"} text-white`}>
        {/* Side Navbar Content */}
        <nav className={`h-full flex ${expanded ? "w-[250px]" : "max-w-[60px]"} md:w-[250px] w-[60px] flex-col bg-white border-r shadow-sm`}>
          <div className=" flex justify-between items-center ">
            <img
              src="/Logo.svg"
              className={`overflow-hidden transition-all w-0 md:w-auto  p-2 md:${expanded ? "w-35" : "w-0"

                }`}
              alt="Logo"
            />
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 md:block hidden  mr-4"
            >
              {expanded ? <ChevronFirst className="text-blue-800"/> : <ChevronLast className=" text-blue-800" />}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <div className="space-y-5 mt-10">
              <Link href="/dashboard/profile" className=" w-[90%] p-3 rounded-md">
                <ul className="px-3 flex items-center md:justify-start justify-center">
                <img src="/profile.svg" />
                <h1 className="md:ml-3  md:block hidden font-normal text-gray-800">{expanded ? "Profile" : ""} </h1>
                </ul>
              </Link>
              <Link href="/dashboard/quizzes" className=" w-[90%] p-3 rounded-md">
              <ul className="px-3 flex items-center md:justify-start justify-center">
                <img src="/quizIcon.svg" />
                <h1 className="md:ml-3 md:block hidden font-normal text-gray-800">{expanded ? "Quizzes" : ""}</h1>
              </ul>
              </Link>
              <Link href="/dashboard/assign-quiz"  className=" w-[90%] p-3 rounded-md">
              <ul className="px-3 flex items-center md:justify-start justify-center">
                <img src="/attemptQuiz.svg" className="h-[80%]" />
                <h1 className="md:ml-3 md:block hidden font-normal text-gray-800">{expanded ? "Assign Quiz" : ""}</h1>
              </ul>
              </Link>
              <Link href="/dashboard/create-quiz"  className=" w-[90%] p-3 rounded-md">
              <ul className="px-3 flex items-center md:justify-start justify-center">
                <img src="/createQuiz.svg"/>
                <h1 className="md:ml-3 md:block hidden font-normal text-gray-800">{expanded ? "Create Quiz" : ""}</h1>
              </ul>
              </Link>
              {/* <Link href="/dashboard/notifications"  className="w-[90%] p-3 rounded-md">
              <ul className="px-3 flex items-center md:justify-start justify-center">
                <img src="/notifications.svg"/>
                <h1 className="md:ml-3 md:block hidden font-normal text-gray-800">{expanded ? "Notifications " : ""}</h1>
              </ul>
              </Link> */}

        <Link href="/dashboard/notifications" className="w-[90%] p-3 rounded-md">
              <ul className="px-3 flex items-center md:justify-start justify-center relative">
                <img src="/notifications.svg" className=""  />
                {unreadCount > 0 && (
                  <span className={`absolute ${expanded ? "top-[8%] left-[10%]" : "top-[10%] right-[20%]" } text-xs font-bold bg-red-600 text-white rounded-full px-1.5`}>
                    {unreadCount}
                  </span>
                )}
                <h1 className="md:ml-3 md:block hidden font-normal text-gray-800">{expanded ? "Notifications " : ""}</h1>
              </ul>
            </Link>


              <Link href="/dashboard/friends"  className="w-[90%] p-3 rounded-md">
              <ul className="px-3 flex items-center md:justify-start justify-center relative">
                <img src="/notifications.svg"/>
                {unreadFriendRequests > 0 && (
                  <span className={`absolute ${expanded ? "top-[8%] left-[10%]" : "top-[10%] right-[20%]" } text-xs font-bold bg-red-600 text-white rounded-full px-1.5`}>
                    {unreadFriendRequests}
                  </span>
                )}
                <h1 className="md:ml-3 md:block hidden font-normal text-gray-800">{expanded ? "Friends" : ""}</h1>
              </ul>
              </Link>
            </div>
          </SidebarContext.Provider>

       <div className="mt-auto md:p-3 border-t flex items-center rounded-md">
      <div className="p-2 bg-blue-100">
        <h1 className="text-2xl font-bold text-primaryBlue">{user?.name[0]}</h1>
      </div>

      <div
        className={`md:flex hidden justify-between items-center overflow-hidden transition-all md:${expanded ? "w-52 ml-3" : "w-0"
          }`}
      >
        <div className="leading-4">
          <h4 className="font-semibold text-gray-800">{user?.name}</h4>
          <span className="text-xs text-gray-600">{user?.email}</span>
        </div>
        </div>

        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVerticalIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          slotProps={{
            paper: {
              sx: {
                maxHeight: 48, // Adjust this value if needed
                width: '20ch',
                overflow: 'hidden', // Ensure overflow is hidden to prevent scrollbars
              },
            },
          }}
        >
          <MenuItem onClick={handleLogout}>
            {`${loading ? "Logging Out": "Logout"}`}
          </MenuItem>
        </Menu>
    </div>
        </nav>
      </aside>
      <main className="flex-1  p-8">
        {/* Main content */}
        {children}
      </main>
    </div>
  );
}



export default withAuth(DashboardLayout);