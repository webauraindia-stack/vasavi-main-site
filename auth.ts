import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { saveGuestProfile } from "@/lib/auth/guest-profiles";
import { normalizePhone } from "@/lib/auth/phone";
import { isValidAadhaarDigits, normalizeAadhaar } from "@/lib/aadhaar";
import { resolveAuthUser } from "@/lib/auth/users-by-phone";
import { consumeVerificationToken } from "@/lib/auth/verification-token";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "whatsapp-otp",
      name: "WhatsApp OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        verificationToken: { label: "Verification Token", type: "text" },
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "text" },
        city: { label: "City", type: "text" },
        aadhaar: { label: "Aadhaar", type: "text" },
      },
      async authorize(credentials) {
        const phone = normalizePhone(String(credentials?.phone ?? ""));
        const verificationToken = String(credentials?.verificationToken ?? "");
        const name = String(credentials?.name ?? "").trim();
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const city = String(credentials?.city ?? "").trim();
        const aadhaar = normalizeAadhaar(String(credentials?.aadhaar ?? ""));

        if (!phone || !verificationToken) {
          return null;
        }

        const knownUser = resolveAuthUser(phone);

        if (knownUser.memberProfile) {
          if (!consumeVerificationToken(verificationToken, phone)) {
            return null;
          }
          const profile = knownUser.memberProfile;
          return {
            id: knownUser.id,
            name: profile.name,
            email: profile.email,
            phone: knownUser.phone,
            city: profile.city,
            isDonor: profile.isDonor,
            donorId: profile.memberId,
            tier: profile.tier ?? undefined,
            categoryLabel: profile.categoryLabel,
            isKnownMember: true,
            profileComplete: true,
          };
        }

        if (!name || !email || !email.includes("@") || !isValidAadhaarDigits(aadhaar)) {
          return null;
        }

        if (!consumeVerificationToken(verificationToken, phone)) {
          return null;
        }

        const guestProfile = saveGuestProfile({
          name,
          email,
          phone,
          city,
          aadhaar,
        });

        return {
          id: `guest-${phone.replace(/\D/g, "")}`,
          name: guestProfile.name,
          email: guestProfile.email,
          phone: guestProfile.phone,
          city: guestProfile.city,
          aadhaar: guestProfile.aadhaar,
          isDonor: false,
          isKnownMember: false,
          profileComplete: true,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isDonor = (user as { isDonor?: boolean }).isDonor ?? false;
        token.donorId = (user as { donorId?: string }).donorId;
        token.tier = (user as { tier?: string }).tier;
        token.phone = (user as { phone?: string }).phone;
        token.city = (user as { city?: string }).city;
        token.aadhaar = (user as { aadhaar?: string }).aadhaar;
        token.categoryLabel = (user as { categoryLabel?: string }).categoryLabel;
        token.isKnownMember = (user as { isKnownMember?: boolean }).isKnownMember ?? false;
        token.profileComplete = (user as { profileComplete?: boolean }).profileComplete ?? true;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { isDonor?: boolean }).isDonor = token.isDonor as boolean;
        (session.user as { donorId?: string }).donorId = token.donorId as string;
        (session.user as { tier?: string }).tier = token.tier as string;
        (session.user as { phone?: string }).phone = token.phone as string;
        (session.user as { city?: string }).city = token.city as string;
        (session.user as { aadhaar?: string }).aadhaar = token.aadhaar as string;
        (session.user as { categoryLabel?: string }).categoryLabel =
          token.categoryLabel as string;
        (session.user as { isKnownMember?: boolean }).isKnownMember =
          token.isKnownMember as boolean;
        (session.user as { profileComplete?: boolean }).profileComplete =
          token.profileComplete as boolean;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
});
