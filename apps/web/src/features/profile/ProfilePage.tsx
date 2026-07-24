import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FieldLabel, Input, Textarea } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Avatar } from "@/components/ui/Avatar";
import { useProfile, useUpdateProfile } from "./api";

interface ProfileForm {
  name: string;
  jobTitle: string;
  department: string;
  address: string;
}

export function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyInApp, setNotifyInApp] = useState(true);

  const { register, handleSubmit, reset, formState: { isSubmitting, isDirty } } = useForm<ProfileForm>({
    defaultValues: { name: "", jobTitle: "", department: "", address: "" },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        jobTitle: profile.jobTitle ?? "",
        department: profile.department ?? "",
        address: profile.address ?? "",
      });
      setNotifyEmail(profile.notifyEmail);
      setNotifyInApp(profile.notifyInApp);
    }
  }, [profile, reset]);

  const onSubmit = async (values: ProfileForm) => {
    try {
      await updateProfile.mutateAsync(values);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  async function handleNotifyChange(key: "notifyEmail" | "notifyInApp", value: boolean) {
    if (key === "notifyEmail") setNotifyEmail(value);
    else setNotifyInApp(value);
    try {
      await updateProfile.mutateAsync({ [key]: value });
    } catch {
      toast.error("Failed to update notification preference");
    }
  }

  if (isLoading || !profile) {
    return (
      <div>
        <PageHeader title="Profile" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Profile" description="Manage your personal information and preferences" />

      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-5 flex items-center gap-3">
            <Avatar name={profile.name} size="md" />
            <div>
              <p className="text-sm font-medium text-text-primary">{profile.name}</p>
              <p className="text-xs text-text-tertiary">{profile.email}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <FieldLabel>Full name</FieldLabel>
              <Input {...register("name", { required: true })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Job title</FieldLabel>
                <Input {...register("jobTitle")} />
              </div>
              <div>
                <FieldLabel>Department</FieldLabel>
                <Input {...register("department")} />
              </div>
            </div>
            <div>
              <FieldLabel>Email</FieldLabel>
              <Input value={profile.email} disabled />
            </div>
            <div>
              <FieldLabel>Address</FieldLabel>
              <Textarea rows={2} placeholder="Street, city, state, postal code" {...register("address")} />
            </div>
            <div className="flex justify-end pt-1">
              <Button type="submit" loading={isSubmitting} disabled={!isDirty || isSubmitting}>
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Switch
            checked={notifyEmail}
            onChange={(v) => handleNotifyChange("notifyEmail", v)}
            label="Email notifications"
            description="Get project and mention updates by email"
          />
          <Switch
            checked={notifyInApp}
            onChange={(v) => handleNotifyChange("notifyInApp", v)}
            label="In-app notifications"
            description="Show notifications in the bell menu"
          />
        </CardContent>
      </Card>
    </div>
  );
}
