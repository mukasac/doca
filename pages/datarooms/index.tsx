import Link from "next/link";
import { useRouter } from "next/router";
import { PlusIcon } from "lucide-react";
import { AddDataroomModal } from "@/components/datarooms/add-dataroom-modal";
import { EmptyDataroom } from "@/components/datarooms/empty-dataroom";
import AppLayout from "@/components/layouts/app";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePlan } from "@/lib/swr/use-billing";
import useDatarooms from "@/lib/swr/use-datarooms";
import useLimits from "@/lib/swr/use-limits";

export default function DataroomsPage() {
  const { datarooms } = useDatarooms();
  const router = useRouter();

  // Access overrides
  const isDatarooms = true;
  const isBusiness = true;
  const canCreateUnlimitedDatarooms = true;

  return (
    <AppLayout>
      <main className="p-6 space-y-8 sm:p-8 bg-gray-50 dark:bg-gray-900">
        <section className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Dataroom Management
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Organize and manage your data rooms effectively.
            </p>
          </div>
          <AddDataroomModal>
            <Button className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-600  flex items-center gap-2 rounded-lg bg-primary text-white px-4 py-2 shadow-md hover:bg-primary-dark">
              <PlusIcon className="h-5 w-5" />
              Create New Dataroom
            </Button>
          </AddDataroomModal>
        </section>

        <Separator className="border-gray-300 dark:border-gray-700" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {datarooms && datarooms.length > 0 ? (
            datarooms.map((dataroom) => (
              <Link key={dataroom.id} href={`/datarooms/${dataroom.id}`}>
                <Card className="relative overflow-hidden rounded-lg border bg-white shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
                      {dataroom.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Documents:</span>
                      <span className="font-bold text-gray-900 dark:text-gray-200">
                        {dataroom._count.documents ?? 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Views:</span>
                      <span className="font-bold text-gray-900 dark:text-gray-200">
                        {dataroom._count.views ?? 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center">
              <EmptyDataroom />
            </div>
          )}
        </div>
      </main>
    </AppLayout>
  );
}
