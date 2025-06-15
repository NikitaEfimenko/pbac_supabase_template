export const calculatePrice = (startTime: string, endTime: string) => {
  if (!startTime || !endTime) return 0
  const start = new Date(`2000-01-01T${startTime}`)
  const end = new Date(`2000-01-01T${endTime}`)
  const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  return Math.max(0, hours * 123)
}