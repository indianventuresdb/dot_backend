import { Users } from "../models/Users.js";
import bcrypt from "bcrypt";


// User Register Controller

export const register = async (req, res) => { }



// User Login Controller

export const login = async (req, res) => { }




// user Logout

export const logout = (req, res) => { }

// get profile data

export const getMyProfile = (req, res) => {
    return res.status(200).json({ message: "Hello there, how are you ?" })
}