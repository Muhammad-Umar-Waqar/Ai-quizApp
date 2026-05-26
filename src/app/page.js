'use client';
// app/page.js
import { usePathname, useRouter } from "next/navigation";
import { Typography } from '@mui/material';
import Link from "next/link";
import { useEffect, useState } from 'react';
import Image from "next/image";
import { delay, motion } from "framer-motion";
import { fadeIn } from '../variant'
import Preloader from "../../utils/loading/preloader";



const Home = () => {
  const router = useRouter();

  function handleSignup() {
    router.push("/signup");
  }




  const animations = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { type: 'spring', stiffness: 200, damping: 25 },
  };

  const SITEMAP = [
    {
      title: 'Resources',
      links: ['Documentation', 'API Reference', 'Tutorials'],
    },
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Press'],
    },
    {
      title: 'Support',
      links: ['Contact Us', 'Help Center', 'Privacy Policy'],
    },
    {
      title: 'Legal',
      links: ['Terms of Service', 'Privacy Policy', 'Cookie Policy'],
    },
  ];

  





  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();
  const [fullPageLoader, setFullPageLoader] = useState(true);
  const pathname = usePathname();
  
  
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  
  
  useEffect(()=>{
    setToken(localStorage.getItem("token"));
    setFullPageLoader(false);
    setFullPageLoader(false);
  },[token, pathname])







  // Define animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Smooth scroll function
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    section.scrollIntoView({ behavior: 'smooth' });
  };



  
  if(fullPageLoader) {
    return (
      <div>
        <Preloader/>
        </div>
    )
  }

if(token) {
  router.push("/dashboard/profile")
}


return (
<>
<div className="md:space-y-auto space-y-5 container" id="section1">
<nav className="bg-gray-100 fixed w-full  left-0  z-20">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 ">
        <div className="relative flex h-16 items-center justify-between">
          {/* <!-- Mobile menu button --> */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400  hover:text-primaryBlue focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* <!-- Logo and navigation links --> */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            {/* <div className="flex flex-shrink-0 items-center">
              
            </div> */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link href="#section1"  onClick={(e) => { e.preventDefault(); scrollToSection('section1'); }} className="rounded-md  px-3 py-2 text-sm font-medium text-primaryBlue hover:text-primaryBlue"  aria-current="page">
                  Dashboard
                </Link>
                <Link href="#section2"  onClick={(e) => { e.preventDefault(); scrollToSection('section2'); }} className="rounded-md px-3 py-2 text-sm font-medium  text-gray-800 hover:text-primaryBlue">
                  Guide
                </Link>
                <Link href="#aboutus"  onClick={(e) => { e.preventDefault(); scrollToSection('aboutus'); }} className="rounded-md px-3 py-2 text-sm font-medium  text-gray-800  hover:text-primaryBlue">
                  About Us
                </Link>
                <Link href="#whyquizzer"  onClick={(e) => { e.preventDefault(); scrollToSection('whyquizzer'); }} className="rounded-md px-3 py-2 text-sm font-medium  text-gray-800 hover:text-primaryBlue">
                  Why Quizzer
                </Link>
              </div>
            </div>
          </div>

          {/* <!-- Logout button --> */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            
         

               <button
              type="button"
              onClick={handleSignup}
              className="relative font-bold py-2 px-4 rounded-full bg-transparent border border-primaryBlue outline-none text-primaryBlue hover:text-primaryBlue focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              {loading? "Signing Up.." : "Sign Up"}
            </button>
 
          </div>
        </div>
      </div>

      {/* <!-- Mobile menu --> */}
      {isMobileMenuOpen && (
        <div className="sm:hidden  z-20 " id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link href="#section1"  onClick={(e) => { e.preventDefault(); scrollToSection('section1'); }} className="block rounded-md px-3 py-2 text-base font-medium text-primaryBlue" aria-current="page">
              Home
            </Link>
            <Link href="#section2"  onClick={(e) => { e.preventDefault(); scrollToSection('section2'); }} className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:text-primaryBlue">
              Guide
            </Link>
            <Link href="#aboutus"  onClick={(e) => { e.preventDefault(); scrollToSection('aboutus'); }} className="block rounded-md px-3 py-2 text-base font-medium  text-gray-800 hover:text-primaryBlue">
              About Us
            </Link>
            <Link href="#whyquizzer"  onClick={(e) => { e.preventDefault(); scrollToSection('whyquizzer'); }} className="block rounded-md px-3 py-2 text-base font-medium  text-gray-800 hover:text-primaryBlue">
              Why Quizzer
            </Link>
          </div>
        </div >
      )}
    </nav > 







{/* HERO */}

<div >

<div className="pt-16" >

    <div className="flex md:flex-row flex-col items-center justify-between  md:space-y-auto space-y-5 xl:my-auto my-6">
      <motion.div
        variants={fadeIn("left", 0.2)}
        initial = "hidden"
        whileInView={"show"}
        viewport={{once: false, amount: 0.7}}
        className="space-y-5 lg:w-auto md:w-[70%] w-auto">
        <h1 className="md:text-5xl sm:text-4xl text-3xl w-[80%] font-bold text-primaryBlue md:leading-tight"><span className="bg-yellow-400">QUIZ APP</span > BEYOND TRADITIONAL LEARNING</h1>
        <p className="w-[70%] text-zinc-500 font-medium">Test Your Skills And Knowledge By Creating, Attempting, And Assigning Quizzes To Other Users </p>
        <button className="px-5 bg-primaryBlue text-white p-3  rounded-full">Join Us Now!</button>
      </motion.div>
      <motion.div
        variants={fadeIn("down", 0.3)}
        initial = "hidden"
        whileInView={"show"}
        viewport={{once: false, amount: 0.7}}>
        
        {/* 450.39 429.98 */}
        {/* <img  src="./hero.png" className="max-h-[430px] "/> */}
        <Image  src="/hero.png" height={590.39} width={569.98} className="mt-5 sm:mt-2  drop-shadow-lg"/>
      </motion.div>
    </div>
    <div className="flex justify-center">
    <div className="w-full bg-primaryBlue flex items-center justify-evenly  p-2 md:py-5 mt-2">
      <h2 className="text-white md:text-xl"><span className="font-bold text-2xl">&#43;100</span> Active Students </h2>
      <h2 className="text-white md:text-xl"><span className="font-bold text-2xl">&#43;50 </span>Available Quizzes</h2>
      <h2 className="text-white md:text-xl"><span className="font-bold text-2xl">&#43;20 </span>High Scorers</h2>
    </div>
    </div>
    </div>    

    </div>

    {/* How to Attempt ? */}
    
    <div className="flex justify-center " id="section2">
    <h1 className=" mt-[60px] text-4xl w-[100%] sm:w-[50%] font-bold text-primaryBlue text-center">COMPLETE GUIDE TO CREATE AND ASSIGN A QUIZ </h1>
    </div>

{/* CARDS SECTION */}
    <div className="grid place-items-center xl:space-y-0 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:space-x-5 mt-10 gap-5">
      
  <motion.div
  variants={fadeIn("up", 0.1)}
  initial = "hidden"
  whileInView={"show"}
  viewport={{once: false, amount: 0.7}}
   
   className="max-w-sm bg-white border border-gray-200  md:mt-0 mt-5 rounded-lg shadow drop-shadow-lg dark:bg-gray-800 dark:border-gray-700">
<div className="m-5 rounded-xl">
      <Image height={336} width={194} layout = "responsive" loading="lazy" className="rounded-xl  shadow-xl shadow-gray-200 " src="/step1.png "  alt="step2" />
</div>
  <div className="p-5">
      <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Step 1</h5>
      </a>
      <p className="mb-3 w-[70%] font-medium text-gray-700 dark:text-gray-400">Add multiple types of questions to your selected quiz. </p>
  </div>
</motion.div>


<motion.div
    variants={fadeIn("up", 0.3)}
    initial = "hidden"
    whileInView={"show"}
    viewport={{once: false, amount: 0.7}}
     className="max-w-sm bg-white border border-gray-200  md:mt-0 mt-5 rounded-lg shadow drop-shadow-lg dark:bg-gray-800 dark:border-gray-700">
  <div className="m-5 rounded-xl">
        <Image height={336} width={194} layout = "responsive" loading="lazy" className="rounded-xl  shadow-xl shadow-gray-200 " src="/step1.png "  alt="step2" />
  </div>
    <div className="p-5">
        <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Step 2</h5>
        </a>
        <p className="mb-3 w-[70%] font-medium text-gray-700 dark:text-gray-400">Add multiple types of questions to your selected quiz. </p>
    </div>
</motion.div>


<motion.div
  variants={fadeIn("up", 0.5)}
  initial = "hidden"
  whileInView={"show"}
  viewport={{once: false, amount: 0.7}}
     className="max-w-sm bg-white border border-gray-200  xl:mt-0 mt-5  rounded-lg shadow drop-shadow-lg dark:bg-gray-800 dark:border-gray-700">
  <div className="m-5 rounded-xl">
        <Image height={336} width={194} layout = "responsive" loading="lazy" className="rounded-xl  shadow-xl shadow-gray-200 " src="/step1.png "  alt="step2" />
  </div>
    <div className="p-5">
        <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Step 3</h5>
        </a>
        <p className="mb-3 w-[60%] font-medium text-gray-700 dark:text-gray-400">Assign Quiz to the User to whom you want to assign </p>
    </div>
</motion.div>

    </div>
    



{/* About Us */}

<div  >


<div className="pt-[80px]">
<svg className=" w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 220" fill="#0099ff"  id="aboutus">
  <path fillOpacity="1" d="M0,64L34.3,58.7C68.6,53,137,43,206,69.3C274.3,96,343,160,411,176C480,192,549,160,617,128C685.7,96,754,64,823,80C891.4,96,960,160,1029,192C1097.1,224,1166,224,1234,208C1302.9,192,1371,160,1406,144L1440,128L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"></path>
</svg>
</div>


<div className="flex justify-center items-center" id="section4">
  
    <h1 className="text-4xl w-[50%] font-bold text-primaryBlue text-center">ABOUT US</h1>
</div>


<div className="mt-10 md:flex items-center justify-center  md:justify-evenly ">

  <motion.div  variants={fadeIn("up", 0.5)}
  initial = "hidden"
  whileInView={"show"}
  viewport={{once: false, amount: 0.7}} className="space-y-5 w-auto md:w-[50%]">
  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-start  text-center">Quizzer: Your Gateway To Learning Through Quizzes</h1>
  <p className="text-md md:text-xl md:text-start  text-gray-500  text-center">Quizzer is your ultimate platform for creating, assigning, and attempting quizzes with ease. Designed for educators, students, and quiz enthusiasts alike, Quizzer offers a seamless experience that makes quizzing both fun and educational. Whether you're building a quiz for a classroom, challenging friends, or testing your own knowledge, our intuitive tools allow you to craft personalized quizzes and track results effortlessly. Join our growing community and discover how Quizzer can enhance your learning and quizzing experience today.</p>
  </motion.div>
 

  
    {/* 396 477 */}
    <motion.div variants={fadeIn("down", 0.5)}
  initial = "hidden"
  whileInView={"show"}
  viewport={{once: false, amount: 0.7}}  
  className="flex items-center justify-center"
  >
    <Image src="/about.png" className="md:mt-auto sm:mt-5 mt-20"
        width={440}
        height={400} 
        loading="lazy"/>
        </motion.div>
  

</div>

</div>




{/* WHY QUIZZER */}
<div className="md:mt-[250px]">

<div className="flex justify-center items-center" id="whyquizzer">
    <h1 className=" md:mt-[60px]  text-4xl sm:w-[50%] font-bold text-primaryBlue text-center">WHY QUIZZER? </h1>
</div>


<div className="grid   place-items-center xl:space-y-0 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:space-x-5 sm:gap-5 gap-20 " style={{marginTop: "50px"}}>
  <motion.div 
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ ...animations.transition, delay: 0.2 }}
   whileInView={{ scale: 1.1, transition: { type: 'spring', stiffness: 200 } }}
   whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 200 } }}
    className="flex flex-col items-center justify-center space-y-5">
<motion.div   initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 10,
            }}
            whileHover={{ scale: 1.1, rotate: 10 }}>
    <Image height={60} width={60} loading="lazy" alt="care about you" src="./car.svg"/>
    </motion.div>
    <h1 className=" text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center ">We CARE about you!</h1>
    <p className="text-center w-[80%] sm:w-[60%] text-sm text-gray-500">At Quizzer, your experience is our top priority. We’ve designed our platform with you in mind, ensuring a user-friendly interface that makes creating and attempting quizzes a breeze.</p>
  </motion.div>

  <motion.div initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ ...animations.transition, delay: 0.4}}
   whileInView={{ scale: 1.1, transition: { type: 'spring', stiffness: 200 } }}
   whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 200 } }}
    className="flex flex-col items-center justify-center space-y-5">
<motion.div   initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 10,
            }}
            whileHover={{ scale: 1.1, rotate: 10 }}>
    <Image height={60} width={60} loading="lazy" alt="24/7 Available" src="./contact.svg"/>
    </motion.div>
    <h1 className=" text-2xl font-bold tracking-tight text-gray-900 dark:text-white w-[70%] text-center">We are here to help you Succeed</h1>
    <p className="text-center w-[80%] sm:w-[60%] text-sm text-gray-500">Success is at the core of what we do. Quizzer offers powerful tools to track progress, refine your skills, and reach your goals.</p>
  </motion.div >

 
  <motion.div   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ ...animations.transition, delay: 0.4}}
   whileInView={{ scale: 1.1, transition: { type: 'spring', stiffness: 200 } }}
   whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 200 } }}
    className="flex flex-col items-center justify-center space-y-5">
<motion.div   initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 10,
            }}
            whileHover={{ scale: 1.1, rotate: 10 }}>
    
    <Image height={60} width={60} loading="lazy" alt="Your satisfaction is our commitment" src="./smile.svg"/>
    </motion.div>
    <h1 className=" text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">Satification Guaranteed</h1>
    <p className="text-center w-[80%] sm:w-[60%] text-sm text-gray-500">Your satisfaction is our priority. We believe Quizzer will exceed your expectations, but if you're not fully satisfied, our dedicated team is here to help.</p>
  </motion.div>
</div>
</div>




<svg className="pt-[50px] md:pt-[150px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fillOpacity="1" d="M0,64L48,106.7C96,149,192,235,288,261.3C384,288,480,256,576,208C672,160,768,96,864,69.3C960,43,1056,53,1152,90.7C1248,128,1344,192,1392,224L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
<footer className="relative w-full">
        <div className="mx-auto w-full max-w-7xl px-8">
        <div className="mx-auto grid w-full grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          {SITEMAP.map(({ title, links }, key) => (
            <div key={key} className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-4 font-bold text-primaryBlue uppercase "
              >
                {title}
              </Typography>
              <ul className="space-y-1">
                {links.map((link, key) => (
                  <Typography key={key} as="li" color="blue-gray" className="font-normal">
                    <a
                      href="#"
                      className="inline-block py-1 pr-2 transition-transform hover:scale-105"
                    >
                      {link}
                    </a>
                  </Typography>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex w-full flex-col items-center justify-center border-t border-blue-gray-50 py-4 md:flex-row md:justify-between">
          <Typography
            variant="small"
            className="mb-4 text-center font-normal text-blue-gray-900 md:mb-0"
          >
            &copy;  <a href="#">Quiz Application</a>. All
            Rights Reserved.
          </Typography>
          <div className="flex gap-4 text-blue-gray-900 sm:justify-center">
            <Typography as="a" href="#" className="opacity-80 transition-opacity hover:opacity-100">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </Typography>
            <Typography as="a" href="#" className="opacity-80 transition-opacity hover:opacity-100">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                />
              </svg>
            </Typography>
            <Typography as="a" href="#" className="opacity-80 transition-opacity hover:opacity-100">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </Typography>
            <Typography as="a" href="#" className="opacity-80 transition-opacity hover:opacity-100">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </Typography>
            <Typography as="a" href="#" className="opacity-80 transition-opacity hover:opacity-100">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                  clipRule="evenodd"
                />
              </svg>
            </Typography>
          </div>
        </div>
      </div>
    </footer>
</div>
  </>
     
  );
};

export default Home;
