// import { signIn, signInWithGoogle } from "@/lib/firebase/services";
// import { compare } from "bcryptjs";
import axios from "@/interceptor/axios";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: "asdasdasd",
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      type: "credentials",
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          let response = await axios.post(`/api/auth/login`, {
            email: email,
            password: password,
          });

          if (response.status === 200) {
            return response.data;
          } else {
            return null;
          }
        } catch (error: any) {
          throw new Error(JSON.stringify(error.response.data));
        }

        // // Add logic here to look up the user from the credentials supplied
        // const user: any = await signIn({ email });

        // if (user) {
        //   const passwordConfirm = await compare(password, user.password);
        //   if (passwordConfirm) {
        //     // Any object returned will be saved in `user` property of the JWT
        //     return user;
        //   }
        //   throw new Error(
        //     JSON.stringify({
        //       field: "password",
        //       message: "Password is wrong",
        //       status: false,
        //     })
        //   );
        // } else {
        //   // If you return null then an error will be displayed advising the user to check their details.
        //   throw new Error(
        //     JSON.stringify({
        //       field: "email",
        //       message: "Email is not registered",
        //       status: false,
        //     })
        //   );

        //   // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        // }
      },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID || "",
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    // }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }: any) {
      if (account?.provider === "credentials") {
        token.email = user.user.email;
        token.name = user.user.name;
        token.role = user.user.role;
        token.token = user.token;
      }
      // if (account?.provider === "google") {
      //   const data = {
      //     fullname: user.name,
      //     email: user.email,
      //     image: user.image,
      //     type: "google",
      //   };

      //   await signInWithGoogle(data, (result: any) => {
      //     if (result.status) {
      //       token.email = result.data.email;
      //       token.fullname = result.data.fullname;
      //       token.type = result.data.type;
      //       token.image = result.data.image;
      //     }
      //   });
      // }
      return token;
    },
    async session({ session, token }: any) {
      if ("email" in token) {
        session.user.email = token.email;
      }
      if ("name" in token) {
        session.user.name = token.name;
      }
      if ("role" in token) {
        session.user.role = token.role;
      }
      if ("image" in token) {
        session.user.image = token.image;
      }
      if ("token" in token) {
        session.user.token = token.token;
      }
      return session;
    },
  },
  pages: {
    // signIn: "/auth/login",
    signIn: "/",
  },
};
