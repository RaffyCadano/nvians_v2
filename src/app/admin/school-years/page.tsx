import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Calendar } from "lucide-react";

export default async function SchoolYearsPage() {
  const supabase = await createClient();

  const { data: schoolYears } = await supabase
    .from("school_years")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Years</h1>
          <p className="text-sm text-gray-500 mt-1">Manage academic school years and terms.</p>
        </div>
        <Button asChild>
          <Link href="/admin/school-years/new">
            <Plus className="mr-2 h-4 w-4" /> New School Year
          </Link>
        </Button>
      </div>

      {schoolYears && schoolYears.length > 0 ? (
        <div className="grid gap-4">
          {schoolYears.map((sy: any) => (
            <Card key={sy.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-50 p-2.5">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{sy.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(sy.start_date).toLocaleDateString()} – {new Date(sy.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className={
                      sy.status === "active"
                        ? "bg-green-100 text-green-700"
                        : sy.status === "upcoming"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }
                  >
                    {sy.status}
                  </Badge>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/school-years/${sy.id}`}>Edit</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/school-years/${sy.id}/terms`}>Terms</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No school years yet</p>
            <p className="text-sm text-gray-400 mt-1">Create your first school year to get started.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/school-years/new">
                <Plus className="mr-2 h-4 w-4" /> Create School Year
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
