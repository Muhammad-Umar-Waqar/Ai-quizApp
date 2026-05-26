import z from "zod";


export const usernameValidation = z.string().min(2, "User Name must be atleast of 2 characters").max(20, "User Name must be Maximum of 20 characters").regex( /^[a-zA-Z0-9_]+$/ ,"UserName must not contain special characters")

export const signupSchema = z.object({
    name: usernameValidation,
    email: z.string().email({message: "Invalid Email Address"}),
    password: z.string().min(6, {message: "Password must be atleast of 6 characters"}).max(15, "Password must be no longer than 15 characters")
})