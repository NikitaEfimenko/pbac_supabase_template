
import { findAllEntities } from '@/entities/entity/server/dal';
import { EntityCard } from '@/entities/entity/ui/entity-card';
import { Card, CardContent } from '@/shared/ui/card';
import { getServerSession } from '@booking/infra/server/get-session';

export async function EntityList() {
  const session = await getServerSession();
  const entities = await findAllEntities(session.user.id);

  if (entities.length === 0) {
      return <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">У вас пока нет доступных сущностей</p>
        </CardContent>
      </Card>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {entities.length > 0 && entities.map((entity) => (
        <EntityCard key={entity.id} entity={entity} />
      ))}
    </div>
  );
} 