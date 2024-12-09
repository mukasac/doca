import { useTeam } from "@/context/team-context";
import { FolderPlusIcon, PlusIcon } from "lucide-react";

import { AddDocumentModal } from "@/components/documents/add-document-modal";
import { DocumentsList } from "@/components/documents/documents-list";
import SortButton from "@/components/documents/filters/sort-button";
import { AddFolderModal } from "@/components/folders/add-folder-modal";
import AppLayout from "@/components/layouts/app";
import { SearchBoxPersisted } from "@/components/search-box";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import useDocuments, { useRootFolders } from "@/lib/swr/use-documents";

export default function Documents() {
  const teamInfo = useTeam();

  const { folders } = useRootFolders();
  const { documents, isValidating, isFiltered } = useDocuments();

  return (
    <AppLayout>
      <div className=" p-6  sm:mx-4 sm:mt-6">
        {/* Header Section */}
        <header className="flex flex-wrap items-center justify-between gap-y-4 pb-4 border-b border-gray-300 dark:border-gray-700">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Manage all your documents in one place.</h1>
            
          </div>
          <div className="flex items-center gap-3">
            <AddDocumentModal>
              <Button
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm"
                title="Add New Document"
              >
                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                <span>Add New Document</span>
              </Button>
            </AddDocumentModal>
            <AddFolderModal>
              <Button
                size="icon"
                variant="outline"
                className="border-gray-400 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md"
              >
                <FolderPlusIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" aria-hidden="true" />
              </Button>
            </AddFolderModal>
          </div>
        </header>

        {/* Filters Section */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-y-4">
          <div className="w-full sm:max-w-xs">
            <SearchBoxPersisted
              loading={isValidating}
              inputClassName="h-10 border-gray-300 dark:border-gray-600 rounded-md"
            />
          </div>
          <SortButton />
        </div>

        {/* Separator */}
        <Separator className="my-6 bg-gray-300 dark:bg-gray-700" />

        {/* Documents List Section */}
        <section>
          <DocumentsList
            documents={documents}
            folders={isFiltered ? [] : folders}
            teamInfo={teamInfo}
          />
        </section>
      </div>
    </AppLayout>
  );
}
