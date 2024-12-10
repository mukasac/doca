import { useState } from "react";
import { useTeam } from "@/context/team-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAnalytics } from "@/lib/analytics";

export function AddDomainModal({
  open,
  setOpen,
  onAddition,
  children,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAddition?: (newDomain: string) => void;
  children?: React.ReactNode;
}) {
  const [domain, setDomain] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const teamInfo = useTeam();
  const analytics = useAnalytics();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (domain === "") return;

    // Add validation for domain (e.g., disallow "papermark" in domain name)
    if (domain.toLowerCase().includes("papermark")) {
      toast.error("Domain cannot contain 'papermark'");
      return;
    }

    setLoading(true);
    const response = await fetch(
      `/api/teams/${teamInfo?.currentTeam?.id}/domains`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: domain,
        }),
      }
    );

    if (!response.ok) {
      const { message } = await response.json();
      setLoading(false);
      setOpen(false);
      toast.error(message);
      return;
    }

    const newDomain = await response.json();
    analytics.capture("Domain Added", { slug: domain });
    toast.success("Domain added successfully! 🎉");

    onAddition && onAddition(newDomain);
    setOpen(false);
    setLoading(false);
    !onAddition && window.open("/settings/domains", "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-start">
          <DialogTitle>Add Domain</DialogTitle>
          <DialogDescription>
            You can easily add a custom domain.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Label htmlFor="domain" className="opacity-80">
            Domain
          </Label>
          <Input
            id="domain"
            placeholder="docs.yourdomain.com"
            className="mb-8 mt-1 w-full"
            onChange={(e) => setDomain(e.target.value)}
          />
          <DialogFooter>
            <Button type="submit" className=" bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-600 focus:bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-600 focus:text-destructive-foreground">
              Add domain
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
