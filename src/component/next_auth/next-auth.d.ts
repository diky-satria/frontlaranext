import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    message: string;
    token: string;
    user: {
      id: number;
      division_id: number;
      name: string;
      email: string;
      role: string;
      created_at: string;
      updated_at: string;
      token: string;
    };
  }
}
