"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGradeCategory, createGradeItem } from "../../actions";

type CategoryRow = {
  id: string;
  name: string;
  weight: number;
  items: { id: string; name: string; maxScore: number }[];
};

export function CategoriesManager({
  classSubjectId,
  categories,
}: {
  classSubjectId: string;
  categories: CategoryRow[];
}) {
  const router = useRouter();
  const [categoryError, setCategoryError] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [itemErrors, setItemErrors] = useState<Record<string, string>>({});
  const [itemLoading, setItemLoading] = useState<Record<string, boolean>>({});

  async function handleAddCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCategoryLoading(true);
    setCategoryError("");
    const result = await createGradeCategory(new FormData(e.currentTarget));
    setCategoryLoading(false);
    if (result?.error) {
      setCategoryError(result.error);
      return;
    }
    e.currentTarget.reset();
    router.refresh();
  }

  async function handleAddItem(categoryId: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setItemLoading((prev) => ({ ...prev, [categoryId]: true }));
    setItemErrors((prev) => ({ ...prev, [categoryId]: "" }));
    const result = await createGradeItem(new FormData(e.currentTarget));
    setItemLoading((prev) => ({ ...prev, [categoryId]: false }));
    if (result?.error) {
      setItemErrors((prev) => ({ ...prev, [categoryId]: result.error! }));
      return;
    }
    e.currentTarget.reset();
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <input type="hidden" name="class_subject_id" value={classSubjectId} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" placeholder="e.g. Quizzes" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="weight">Weight (%)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  min={0}
                  step={0.01}
                  defaultValue={0}
                />
              </div>
            </div>
            {categoryError && <p className="text-sm text-red-600">{categoryError}</p>}
            <Button type="submit" size="sm" disabled={categoryLoading}>
              {categoryLoading ? "Adding…" : "Add category"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {categories.length > 0 ? (
        categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between gap-2">
                <span>{category.name}</span>
                <span className="text-sm font-normal text-gray-500">Weight: {category.weight}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.items.length > 0 ? (
                <ul className="divide-y rounded-lg border text-sm">
                  {category.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between px-3 py-2"
                    >
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <span className="text-gray-500">Max {item.maxScore}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No grade items in this category yet.</p>
              )}

              <form
                onSubmit={(e) => handleAddItem(category.id, e)}
                className="space-y-3 border-t pt-4"
              >
                <input type="hidden" name="class_subject_id" value={classSubjectId} />
                <input type="hidden" name="category_id" value={category.id} />
                <p className="text-sm font-medium text-gray-700">Add grade item</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor={`item-name-${category.id}`}>Item name *</Label>
                    <Input
                      id={`item-name-${category.id}`}
                      name="name"
                      placeholder="e.g. Quiz 1"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`item-max-${category.id}`}>Max score</Label>
                    <Input
                      id={`item-max-${category.id}`}
                      name="max_score"
                      type="number"
                      min={1}
                      step={0.01}
                      defaultValue={100}
                    />
                  </div>
                </div>
                {itemErrors[category.id] && (
                  <p className="text-sm text-red-600">{itemErrors[category.id]}</p>
                )}
                <Button type="submit" size="sm" variant="outline" disabled={itemLoading[category.id]}>
                  {itemLoading[category.id] ? "Adding…" : "Add item"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="py-10 text-center text-gray-500 text-sm">
            Add a category (e.g. Quizzes, Exams) before entering student scores.
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Button asChild size="sm">
          <Link href={`/teacher/grades/${classSubjectId}/scores`}>Enter scores</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/teacher/grades">Back to grades</Link>
        </Button>
      </div>
    </div>
  );
}
