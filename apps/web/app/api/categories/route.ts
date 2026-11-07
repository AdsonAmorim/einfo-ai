import { getCategories } from "@/lib/queries";

export async function GET() {
  return Response.json(await getCategories());
}
