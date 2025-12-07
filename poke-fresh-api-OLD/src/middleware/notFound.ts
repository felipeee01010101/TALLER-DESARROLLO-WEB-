export function notFound(req: any, res: any, next: any) {
  res.status(404).json({ error: "Ruta no encontrada" });
}
