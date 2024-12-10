import Link from "next/link";
import { useRouter } from "next/router";

import { useState } from "react";

import { useTeam } from "@/context/team-context";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { mutate } from "swr";

import AppLayout from "@/components/layouts/app";
import { SettingsHeader } from "@/components/settings/settings-header";
import Folder from "@/components/shared/icons/folder";
import MoreVertical from "@/components/shared/icons/more-vertical";
import { AddTeamMembers } from "@/components/teams/add-team-member-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { useAnalytics } from "@/lib/analytics";
import { useInvitations } from "@/lib/swr/use-invitations";
import { useGetTeam } from "@/lib/swr/use-team";
import { useTeams } from "@/lib/swr/use-teams";
import { CustomUser } from "@/lib/types";

export default function Billing() {
  const [isTeamMemberInviteModalOpen, setTeamMemberInviteModalOpen] =
    useState<boolean>(false);
  const [leavingUserId, setLeavingUserId] = useState<string>("");

  const { data: session } = useSession();
  const { team, loading } = useGetTeam()!;
  const teamInfo = useTeam();
  const { teams } = useTeams();
  const analytics = useAnalytics();

  const { invitations } = useInvitations();

  const router = useRouter();

  const getUserDocumentCount = (userId: string) => {
    const documents = team?.documents.filter(
      (document) => document.owner.id === userId
    );
    return documents?.length;
  };

  const isCurrentUser = (userId: string) => {
    return (session?.user as CustomUser)?.id === userId;
  };

  const isCurrentUserAdmin = () => {
    return team?.users.some(
      (user) =>
        user.role === "ADMIN" &&
        user.userId === (session?.user as CustomUser)?.id
    );
  };

  const changeRole = async (teamId: string, userId: string, role: string) => {
    const response = await fetch(`/api/teams/${teamId}/change-role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userToBeChanged: userId,
        role: role,
      }),
    });

    if (response.status !== 204) {
      const error = await response.json();
      toast.error(error.message);
      return;
    }

    await mutate(`/api/teams/${teamId}`);
    await mutate("/api/teams");

    analytics.capture("Team Member Role Changed", {
      userId: userId,
      teamId: teamId,
      role: role,
    });

    toast.success("Role changed successfully!");
  };

  const removeTeammate = async (teamId: string, userId: string) => {
    setLeavingUserId(userId);
    const response = await fetch(`/api/teams/${teamId}/remove-teammate`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userToBeDeleted: userId,
      }),
    });

    if (response.status !== 204) {
      const error = await response.json();
      toast.error(error.message);
      setLeavingUserId("");
      return;
    }

    await mutate(`/api/teams/${teamInfo?.currentTeam?.id}`);
    await mutate("/api/teams");

    setLeavingUserId("");
    if (isCurrentUser(userId)) {
      toast.success(`Successfully left team ${teamInfo?.currentTeam?.name}`);
      teamInfo?.setCurrentTeam({ id: teams![0].id });
      router.push("/documents");
      return;
    }

    analytics.capture("Team Member Removed", {
      userId: userId,
      teamId: teamInfo?.currentTeam?.id,
    });

    toast.success("Teammate removed successfully!");
  };

  const resendInvitation = async (invitation: { email: string }) => {
    const response = await fetch(
      `/api/teams/${teamInfo?.currentTeam?.id}/invitations/resend`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: invitation.email,
        }),
      }
    );

    if (response.status !== 200) {
      const error = await response.json();
      toast.error(error.message);
      return;
    }

    analytics.capture("Team Member Invitation Resent", {
      email: invitation.email,
      teamId: teamInfo?.currentTeam?.id,
    });

    toast.success("Invitation resent successfully!");
  };

  const revokeInvitation = async (invitation: { email: string }) => {
    const response = await fetch(
      `/api/teams/${teamInfo?.currentTeam?.id}/invitations`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: invitation.email,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message);
      return;
    }

    analytics.capture("Team Member Invitation Revoked", {
      email: invitation.email,
      teamId: teamInfo?.currentTeam?.id,
    });

    mutate(`/api/teams/${teamInfo?.currentTeam?.id}/invitations`);

    toast.success("Invitation revoked successfully!");
  };

  return (
    <AppLayout>
      <main className="relative mx-2 mb-10 mt-4 space-y-8 overflow-hidden px-1">
        <SettingsHeader />
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">
            Teammates that have access to this project.
            </h3>
          </div>
          <div className="flex items-center justify-between">
            
            <AddTeamMembers
              open={isTeamMemberInviteModalOpen}
              setOpen={setTeamMemberInviteModalOpen}
            >
              <Button className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-600 float-right">Invite</Button>
            </AddTeamMembers>
          </div>

          <ul className="mt-6 divide-y rounded-lg border">
            {loading && (
              <div className="flex items-center justify-between px-10 py-4">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-4 w-36" />
              </div>
            )}
            {team?.users.map((member, index) => (
              <li
                className="flex items-center justify-between px-10 py-4"
                key={index}
              >
                <div>
                  <h4 className="text-sm font-semibold">
                    {member.user.name}
                  </h4>
                  <p className="text-xs">{member.user.email}</p>
                </div>
              </li>
            ))}
            {invitations?.map((invitation, index) => (
              <li
                className="flex items-center justify-between px-10 py-4"
                key={index}
              >
                <h4 className="text-sm font-semibold">{invitation.email}</h4>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </AppLayout>
  );
}
