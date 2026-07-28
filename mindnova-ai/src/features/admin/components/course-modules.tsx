"use client";

import { useEffect, useState } from "react";
import {
  getModules,
  createModule,
  Module,
} from "../services/admin-modules.service";

export default function CourseModules({
  courseId,
}: {
  courseId: number;
}) {
  const [modules, setModules] = useState<Module[]>([]);
  const [title, setTitle] = useState("");

  const load = async () => {
    const data = await getModules(courseId);
    setModules(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!title) return;

    await createModule(courseId, {
      title,
    });

    setTitle("");
    load();
  };

  return (
    <div>

      <h2 className="text-xl font-bold mb-4">
        Modules
      </h2>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tên module"
        />

        <button
          className="bg-blue-500 text-white px-4"
          onClick={handleCreate}
        >
          Thêm
        </button>
      </div>

      {modules.map((m) => (
        <div
          key={m.id}
          className="border rounded p-3 mb-2"
        >
          {m.title}
        </div>
      ))}

    </div>
  );
}