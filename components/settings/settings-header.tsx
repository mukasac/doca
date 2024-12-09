import { useTeam } from "@/context/team-context";
import useSWR from "swr";

import { fetcher } from "@/lib/utils";

import { NavMenu } from "../navigation-menu";

export function SettingsHeader() {
  const teamInfo = useTeam();
  const { data: features } = useSWR<{ tokens: boolean; webhooks: boolean }>(
    teamInfo?.currentTeam?.id
      ? `/api/feature-flags?teamId=${teamInfo.currentTeam.id}`
      : null,
    fetcher
  );

  return (
    <header className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-600 p-6 text-white rounded-lg shadow-md">
      <section className="mb-6 flex flex-col items-start justify-between md:flex-row md:items-center md:mb-10 lg:mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Settings
          </h1>
          <p className="text-base font-medium text-gray-100 sm:text-lg">
            Manage your account settings.
          </p>
        </div>
      </section>

      <nav className="flex flex-wrap gap-4 mt-6">
        {[
          { label: "Overview", href: `/settings/general`, segment: "general" },
          { label: "People", href: `/settings/people`, segment: "people" },
          { label: "Domains", href: `/settings/domains`, segment: "domains" },
          { label: "Presets", href: `/settings/presets`, segment: "presets" },
          { label: "Billing", href: `/settings/billing`, segment: "billing" },
          {
            label: "Tokens",
            href: `/settings/tokens`,
            segment: "tokens",
            disabled: !features?.tokens,
          },
          {
            label: "Webhooks",
            href: `/settings/webhooks`,
            segment: "webhooks",
            disabled: !features?.webhooks,
          },
        ].map((item) => (
          <a
            key={item.segment}
            href={item.href}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-150 ${
              item.disabled
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-white text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800"
            }`}
            aria-disabled={item.disabled}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
