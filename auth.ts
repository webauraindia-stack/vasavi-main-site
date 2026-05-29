import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { normalizePhone } from "@/lib/auth/phone";
import { accessTokenExpiresAt } from "@/lib/auth/token-lifetime";

export type SessionUserPayload = {
  id: string;
  name: string;
  phone: string;
  role: string;
  isDonor: boolean;
  donorId?: string;
  accessToken: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "whatsapp-otp",
      name: "WhatsApp OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        accessToken: { label: "Access Token", type: "text" },
        userJson: { label: "User", type: "text" },
        donorProfileJson: { label: "Donor Profile", type: "text" },
      },
      async authorize(credentials) {
        const phone = normalizePhone(String(credentials?.phone ?? ""));
        const accessToken = String(credentials?.accessToken ?? "").trim();
        const userJson = String(credentials?.userJson ?? "");

        if (!phone || !accessToken || !userJson) {
          return null;
        }

        let user: { id: string; name: string; role: string; phone: string };
        try {
          user = JSON.parse(userJson) as typeof user;
        } catch {
          return null;
        }

        let donorId: string | undefined;
        const donorRaw = String(credentials?.donorProfileJson ?? "");
        if (donorRaw) {
          try {
            const donor = JSON.parse(donorRaw) as { donor_id?: string };
            donorId = donor.donor_id;
          } catch {
            donorId = undefined;
          }
        }

        return {
          id: user.id,
          name: user.name || phone,
          email: `${phone}@vasavi.local`,
          phone,
          role: user.role,
          isDonor: user.role === "donor",
          donorId,
          accessToken,
          profileComplete: true,
          isKnownMember: user.role === "donor",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session: updateSession }) {
      if (user) {
        const u = user as SessionUserPayload & {
          accessToken: string;
          role: string;
          isDonor: boolean;
          donorId?: string;
        };
        token.accessToken = u.accessToken;
        token.accessTokenExpires = accessTokenExpiresAt();
        token.phone = u.phone;
        token.role = u.role;
        token.isDonor = u.isDonor;
        token.donorId = u.donorId;
        token.isKnownMember = u.isDonor;
        token.profileComplete = true;
        token.error = undefined;
      }

      if (trigger === "update" && updateSession) {
        const next = updateSession as {
          accessToken?: string;
          accessTokenExpires?: number;
          name?: string;
        };
        if (next.accessToken) {
          token.accessToken = next.accessToken;
          token.accessTokenExpires =
            next.accessTokenExpires ?? accessTokenExpiresAt();
          token.error = undefined;
        }
        if (next.name) {
          token.name = next.name;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session as { accessToken?: string }).accessToken = token.accessToken as string;
        (session as { accessTokenExpires?: number }).accessTokenExpires =
          token.accessTokenExpires as number | undefined;
        (session as { error?: string }).error = token.error as string | undefined;
        (session.user as { phone?: string }).phone = token.phone as string;
        (session.user as { isDonor?: boolean }).isDonor = token.isDonor as boolean;
        (session.user as { donorId?: string }).donorId = token.donorId as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { isKnownMember?: boolean }).isKnownMember =
          token.isKnownMember as boolean;
        (session.user as { profileComplete?: boolean }).profileComplete =
          token.profileComplete as boolean;
        if (token.name) {
          session.user.name = token.name as string;
        }
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
});
