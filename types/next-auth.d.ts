import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    accessTokenExpires?: number;
    error?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string;
      isDonor?: boolean;
      donorId?: string;
      role?: string;
      isKnownMember?: boolean;
      profileComplete?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    accessTokenExpires?: number;
    error?: string;
    phone?: string;
    role?: string;
    isDonor?: boolean;
    donorId?: string;
    isKnownMember?: boolean;
    profileComplete?: boolean;
  }
}
