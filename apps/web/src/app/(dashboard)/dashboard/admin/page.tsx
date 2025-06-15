import { findEntitiesByOwnerId } from "@/entities/entity/server/dal";
import { CreateEntityDialog } from "@/features/create-entity/ui/create-entity-dialog";
import { EntitiesTable } from "@/widgets/entity-table/ui";
import { getServerSession } from "@booking/infra/server/get-session";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Админ панель",
  description: "Админ панель",
};

export default async function AdminPage() {
  const session = await getServerSession()
  const entities = await findEntitiesByOwnerId(session?.user.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold mb-2">Entity Management</h1>
          <CreateEntityDialog userId={session?.user.id} role={session?.role} />
        </div>
        <EntitiesTable entities={entities} />
      </div>
    </div>
  );
}