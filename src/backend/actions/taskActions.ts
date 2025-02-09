"use server"

import { revalidatePath } from "next/cache"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function obtenerTodasTareas() {
  try {
    const tasks = await prisma.task.findMany({
      include: { project: true },
    })
    return { success: true, data: tasks }
  } catch (error) {
    console.error("Error fetching obtenerTodasTareas:", error)
    return { success: false, error: "Fail to FETCH" }
  }
}

export async function obtenerTareasOrdenadasPorProyecto() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        task: true,
      },
    })

    const projectStats = projects.map((project) => ({
      id: project.id,
      name: project.name,
      completed: project.task.filter((t) => t.status === "Terminado").length,
      pending: project.task.filter((t) => t.status === "Pendiente" || t.status === "En progreso").length,
    }))

    return { success: true, data: projectStats }
  } catch (error) {
    console.error("Error fetching obtenerTareasOrdenadasPorProyecto:", error)
    return { success: false, error: "Fail to FETCH" }
  }
}

export async function obtenerProyectos(projectId: number) {
  try {
    const tasks = await prisma.task.findMany({
      where: { projectid: projectId },
    })
    return { success: true, data: tasks }
  } catch (error) {
    console.error("Error fetching obtenerProyectos:", error)
    return { success: false, error: "Fail to FETCH" }
  }
}

export async function tareasStatus(status: string) {
  try {
    const tasks = await prisma.task.findMany({
      where: { status },
    })
    return { success: true, data: tasks }
  } catch (error) {
    console.error("Error fetch tareaStatus:", error)
    return { success: false, error: "Fail to FETCH" }
  }
}

export async function addTarea(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const status = formData.get("status") as string
    const projectId = Number.parseInt(formData.get("projectId") as string)

    const newTask = await prisma.task.create({
      data: { title, status, projectid: projectId },
    })

    revalidatePath("/tasks")
    return { success: true, data: newTask }
  } catch (error) {
    console.error("Error:", error)
    return { success: false, error: "Error al añadir la tarea" }
  }
}

export async function modificarStatusTarea(formData: FormData) {
  try {
    const taskId = Number.parseInt(formData.get("taskId") as string)
    const newStatus = formData.get("status") as string

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus },
    })

    revalidatePath("/tasks")
    return { success: true, data: updatedTask }
  } catch (error) {
    console.error("Error:", error)
    return { success: false, error: "Error al actualizar el estado de la tarea" }
  }
}

export async function eliminarTarea(formData: FormData) {
  try {
    const taskId = Number.parseInt(formData.get("taskId") as string)

    await prisma.task.delete({
      where: { id: taskId },
    })

    revalidatePath("/tasks")
    return { success: true, message: "Tarea eliminada" }
  } catch (error) {
    console.error("Error deleting task:", error)
    return { success: false, error: "Ha habido un error para eliminar la tarea" }
  }
}