import { Badge } from "@/shared/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table"

import { UpdateEntityDialog } from "@/features/update-entity/ui/update-entity-dialog"
import { RemoveEntityDialog } from "@/features/remove-entity/ui/remove-entity-dialog"
import { Entity } from "@/entities/entity/model/types"

export const EntitiesTable = ({ entities }: { entities: Entity[] }) => {

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Capacity</TableHead>
            {/* <TableHead>Цена/час</TableHead> */}
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entities.map((entity) => (
            <TableRow key={entity.id}>
              <TableCell className="font-medium">{entity.name}</TableCell>
              <TableCell className="max-w-xs truncate">{entity.address}</TableCell>
              <TableCell>{entity.capacity} чел.</TableCell>
              {/* <TableCell>{entity.price_per_hour.toLocaleString("ru-RU")} ₽</TableCell> */}
              <TableCell>
                <Badge variant="secondary">Активна</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <UpdateEntityDialog entity={entity} />
                  <RemoveEntityDialog entityId={entity.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

  )
}
