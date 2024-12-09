import Link from "next/link";
import { useRouter } from "next/router";

import { TeamContextType, useTeam } from "@/context/team-context";
import { Check, Loader, PlusIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Team } from "@/lib/types";
import { cn } from "@/lib/utils";

const SelectTeam = ({ teams, currentTeam, isLoading }: TeamContextType) => {
  const router = useRouter();
  const userTeam = useTeam();

  const switchTeam = (team: Team) => {
    localStorage.setItem("currentTeamId", team.id);
    userTeam?.setCurrentTeam(team);
    router.push("/documents");
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center gap-3 text-base font-medium text-gray-600 dark:text-gray-300">
          <Loader className="h-6 w-6 animate-spin text-blue-500" />
          Loading teams...
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex w-full cursor-pointer items-center justify-between rounded-lg border bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 text-sm">
                  <AvatarFallback>
                    {currentTeam?.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
                  {currentTeam?.name || "Select a Team"}
                </p>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72 rounded-lg border bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => switchTeam(team)}
                className={cn(
                  `flex items-center justify-between rounded-md px-4 py-2 text-base transition-all duration-150 hover:bg-blue-100 dark:hover:bg-blue-900`,
                  team.id === currentTeam?.id && "bg-blue-50 font-semibold dark:bg-blue-800"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8 text-sm">
                    <AvatarFallback>
                      {team.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-gray-700 dark:text-gray-200">{team.name}</p>
                </div>

                {team.id === currentTeam?.id && (
                  <Check className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                )}
              </div>
            ))}

            <Link
              href="/settings/people"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white transition-all duration-150 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <PlusIcon className="h-5 w-5" />
              Invite Members
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default SelectTeam;
