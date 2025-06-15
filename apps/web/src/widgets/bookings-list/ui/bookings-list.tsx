import { getMyReservations } from "@/entities/reservation/server/actions"
import { ReservationWithEntity } from "@/entities/reservation/types"
import { DownloadPdf } from "@/features/download-pdf/ui/download-pdf"
import { PayReservationDialog } from "@/features/emulate-pay/ui/emulate-pay-dialog"
import { Badge } from "@/shared/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Calendar, Clock, MapPin } from "lucide-react"

export default async function BookingsList() {
  const { data: bookings = [], error } = await getMyReservations();

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Ошибка при загрузке бронирований: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: ReservationWithEntity['status']) => {
    const variants = {
      pending_payment: "secondary",
      reserved: "default",
      cancelled: "destructive",
      expired: "destructive"
    } as const

    const labels = {
      pending_payment: "Ожидает оплаты",
      reserved: "Забронировано",
      cancelled: "Отменено",
      expired: "Просрочено"
    }

    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  return (
    <div className="space-y-4">
      {bookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">You don't have any reservations yet.</p>
          </CardContent>
        </Card>
      ) : (
        bookings.map((booking: ReservationWithEntity) => (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{booking.entity.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {booking.entity.address}
                  </div>
                </div>
                {getStatusBadge(booking.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(new Date(booking.bookingDate), "dd MMMM yyyy", { locale: ru })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {booking.startTime} - {booking.endTime}
                  </span>
                </div>
                <div className="text-sm font-medium">{booking.totalPrice.toLocaleString()} ₽</div>
              </div>

              <div className="flex gap-2">
                <DownloadPdf entity={booking.entity} />
                {booking.status === "pending_payment" && <PayReservationDialog reservationId={booking.id} />}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
