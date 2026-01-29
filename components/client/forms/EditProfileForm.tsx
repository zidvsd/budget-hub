import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { Camera } from "lucide-react";
import { useUsers } from "@/store/useUsers";
import { getFirstChar } from "@/lib/utils";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
export function EditProfileForm() {
  const { users, fetchUsers } = useUsers();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = useState(users[0]?.first_name || "");
  const [lastName, setLastName] = useState(users[0]?.first_name || "");
  const [phoneNumber, setPhoneNumber] = useState(users[0]?.phone || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // avatar uploads
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side size check (e.g., 2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await fetch("/api/client/user/upload", {
        // Use your upload endpoint
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || "Upload failed");

      // After successful upload, refresh the user store to show the new image
      await fetchUsers(true);
      toast.success("Avatar updated!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };
  // form uploads
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Trim inputs
    const fName = firstName.trim();
    const lName = lastName.trim();
    const phone = phoneNumber.trim();

    // Validation
    if (!fName || !/^[a-zA-Z]{2,30}$/.test(fName)) {
      toast.error("First name must be 2-30 letters.");
      setLoading(false);
      return;
    }

    if (!lName || !/^[a-zA-Z]{2,30}$/.test(lName)) {
      toast.error("Last name must be 2-30 letters.");
      setLoading(false);

      return;
    }

    if (phone && !/^\d{7,15}$/.test(phone)) {
      toast.error("Phone number must be 7-15 digits.");
      setLoading(false);

      return;
    }

    try {
      const res = await fetch("/api/client/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone: phoneNumber,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to update profile");
        throw new Error("Failed to update profile");
      }

      await fetchUsers(true);

      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error("Profile update error:", err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog>
      {/* 🔹 THIS replaces your old button */}
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="w-fit mt-2 transition-transform duration-300 hover:scale-105"
        >
          <Settings className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information and avatar{" "}
            </DialogDescription>
          </DialogHeader>
          {/* avatar */}
          <div className="flex self-center w-full items-center justify-center mt-4">
            <div className="w-28 h-28 relative rounded-full border-4 border-accent/20 bg-muted flex items-center justify-center text-accent text-4xl font-bold">
              {users[0].avatar_url ? (
                <Image
                  src={users[0].avatar_url}
                  alt={`${users[0].first_name} ${users[0].last_name}`}
                  width={112}
                  height={112}
                  className="object-cover rounded-full w-full h-full"
                />
              ) : (
                <span className="uppercase">
                  {getFirstChar(users[0]?.first_name)}
                  {getFirstChar(users[0]?.last_name)}
                </span>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />

              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                type="button"
                size="icon"
                variant="accent"
                className="absolute hover-utility hover:scale-110 bottom-1 right-1 h-8 w-8 rounded-full shadow-md"
              >
                {uploading ? (
                  <Spinner className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 " />
                )}
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            <Field data-disabled>
              <Label htmlFor="input-disabled">Email</Label>
              <Input
                autoComplete="off"
                id="input-disabled"
                type="email"
                placeholder={users[0]?.email}
                disabled
              />
              <FieldDescription>Email cannot be changed.</FieldDescription>
            </Field>
            <div className="grid gap-3">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="off"
                id="firstName"
                placeholder={
                  users[0].first_name
                    ? users[0].first_name
                    : "Enter your first name"
                }
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="off"
                id="lastName"
                placeholder={
                  users[0].last_name
                    ? users[0].last_name
                    : "Enter your last name"
                }
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                onChange={(e) => setPhoneNumber(e.target.value)}
                autoComplete="off"
                id="phone-number"
                placeholder={
                  users[0].phone ? users[0].phone : "Enter your phone number"
                }
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="accent" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
