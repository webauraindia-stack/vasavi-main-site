"use client";

import { useSession } from "next-auth/react";
import { Crown, Mail, Phone, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatPhoneDisplay } from "@/lib/auth/phone";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user as {
    isDonor?: boolean;
    tier?: string;
    donorId?: string;
    phone?: string;
    city?: string;
    categoryLabel?: string;
    isKnownMember?: boolean;
  };

  const displayPhone = user?.phone ? formatPhoneDisplay(user.phone) : "";

  return (
    <div>
      <h2 className="font-display text-xl text-charcoal mb-6">My Profile</h2>

      <div className="card-surface rounded-xl p-6 border border-charcoal/10 space-y-6 max-w-lg">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-champagne/30 flex items-center justify-center text-2xl font-display text-champagne">
            {session?.user?.name?.[0] ?? "U"}
          </div>
          <div>
            <p className="font-display text-xl text-charcoal">{session?.user?.name}</p>
            <p className="text-sm text-muted flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              {session?.user?.email}
            </p>
            {displayPhone && (
              <p className="text-sm text-muted flex items-center gap-1 mt-1">
                <Phone className="h-3.5 w-3.5" />
                {displayPhone}
              </p>
            )}
            {user?.isDonor && user.tier && (
              <Badge variant="donor" className="mt-2 capitalize">
                <Crown className="h-3 w-3 mr-1" />
                {user.tier} Donor
              </Badge>
            )}
            {user?.categoryLabel && !user.isDonor && (
              <Badge variant="outline" className="mt-2">
                {user.categoryLabel}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              defaultValue={session?.user?.name ?? ""}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue={session?.user?.email ?? ""}
              disabled
              className="mt-1 opacity-60"
            />
          </div>
          <div>
            <Label htmlFor="phone">Mobile</Label>
            <Input
              id="phone"
              value={displayPhone}
              disabled
              className="mt-1 opacity-60"
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              defaultValue={user?.city ?? ""}
              className="mt-1"
            />
          </div>
          {user?.isDonor && user.donorId && (
            <div>
              <Label>Donor ID</Label>
              <Input value={user.donorId} disabled className="mt-1 opacity-60" />
            </div>
          )}
          {user?.city && (
            <p className="text-xs text-muted flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {user.city}
            </p>
          )}
        </div>

        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
