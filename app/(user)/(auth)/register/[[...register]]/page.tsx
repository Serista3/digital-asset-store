import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Register',
};

export default function Register(){
  return (
    <SignUp />
  )
}