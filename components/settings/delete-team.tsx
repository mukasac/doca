import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useDeleteTeamModal } from "./delete-team-modal";

export default function DeleteTeam() {
  const { setShowDeleteTeamModal, DeleteTeamModal } = useDeleteTeamModal();

  return (
    <div className="">
      <DeleteTeamModal />
      
        <CardHeader>
          <CardTitle>Delete Team</CardTitle>
          <CardDescription>
            Permanently delete your team, custom domains, and all associated
            documents, links + their views. <br />
            <span className="font-medium">This action cannot be undone</span> -
            please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter className="flex items-center justify-end px-6 py-3">
          <div className="shrink-0">
            <Button
              onClick={() => setShowDeleteTeamModal(true)}
              // variant="destructive"
              className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-600 "
            >
              Delete Team
            </Button>
          </div>
        </CardFooter>
      
    </div>
  );
}
