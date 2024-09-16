import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/api/notes", async (req, res) => {
  const notes = await prisma.note.findMany();
  res.json(notes);
});

app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const note = await prisma.note.create({
      data: {
        title,
        content,
      },
    });
    res.json(note);
  } catch (error) {
    res.status(500).send("An error occurred while creating the note");
  }
});

app.put("/api/notes/:id", async (req, res) => {
  const { title, content } = req.body;
  const id = parseInt(req.params.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid note id" });
  }

  try {
    const updatedNote = await prisma.note.update({
      where: {
        id,
      },
      data: {
        title,
        content,
      },
    });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).send("An error occurred while updating the note");
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid note id" });
  }

  try {
    await prisma.note.delete({
      where: {
        id,
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).send("An error occurred while deleting the note");
  }
});

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});