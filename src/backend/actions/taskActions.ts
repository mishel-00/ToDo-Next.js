"use server"

import { revalidatePath } from "next/cache"
import { PrismaClient } from "@prisma/client"
import path from "path"
import { writeFile } from "fs/promises"
import { randomUUID } from "crypto"

const prisma = new PrismaClient()

//* Necesario
interface TaskUpdateData {
  title?: string
  description?: string
  status?: string
  priority?: string
  tags?: string
  startDate?: Date
  dueDate?: Date
}

interface ProjectUpdateData {
  name?: string
  description?: string
  startDate?: Date
  endDate?: Date
}

/**
 * Obtener todas las tareas con su proyecto y archivos adjuntos
 */
export async function obtenerTodasTareas() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        project: true,
        attachments: true,
      },
    })
    return { success: true, data: tasks }
  } catch (error) {
    console.error("Error fetching obtenerTodasTareas:", error)
    return { success: false, error: "Fail to FETCH" }
  }
}
export async function agregarTarea(formData: FormData) {
  try {
    const title = formData.get("title") as string
    if (!title || typeof title !== "string") {
      return { success: false, message: "El título es requerido" }
    }
    const description = formData.get("description") as string
    const priority = formData.get("priority") as string
    const startDate = formData.get("startDate") ? new Date(formData.get("startDate") as string) : null
    const dueDate = formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : null
    const projectId = Number.parseInt(formData.get("projectId") as string, 10)

    // Guardar imagen si se subió una
    let fileUrl = null
    if (formData.get("image")) {
      const file = formData.get("image") as File
      fileUrl = `/uploads/${file.name}` 
    }

    const nuevaTarea = await prisma.task.create({
      data: {
        title,
        description,
        status: "Pendiente",
        priority,
        startDate,
        dueDate,
        projectId,
        attachments: fileUrl ? { create: { fileUrl, fileName: fileUrl.split("/").pop()! } } : undefined,
      },
      include: { attachments: true },
    })

    revalidatePath("/proyectos")
    return { success: true, data: nuevaTarea }
  } catch (error) {
    console.error("Error al agregar tarea:", error)
    return { success: false, message: "No se pudo agregar la tarea." }
  }
}
export async function modificarStatusTarea(taskIdOrFormData: number | FormData, newStatus?: string) {
  try {
    let taskId: number
    let status: string

    if (taskIdOrFormData instanceof FormData) {
      taskId = Number.parseInt(taskIdOrFormData.get("taskId") as string)
      status = taskIdOrFormData.get("status") as string
    } else {
      taskId = taskIdOrFormData
      status = newStatus as string
    }

    if (isNaN(taskId) || !status) {
      throw new Error("Invalid taskId or status")
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    })

    revalidatePath("/proyectos")
    return { success: true, data: updatedTask }
  } catch (error) {
    console.error("Error:", error)
    return { success: false, error: "Error al actualizar el estado de la tarea" }
  }
}

/**
 * Obtener proyectos con tareas ordenadas
 */
export async function obtenerTareasOrdenadasPorProyecto() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        tasks: {
          include: { attachments: true },
          orderBy: { priority: "desc" }, // Ordena por prioridad (Alta primero)
        },
      },
    })

    return { success: true, data: projects }
  } catch (error) {
    console.error("Error fetching obtenerTareasOrdenadasPorProyecto:", error)
    return { success: false, error: "Fail to FETCH" }
  }
}

/**
 * Eliminar una tarea por ID
 */
export async function eliminarTarea(taskId: number) {
  try {
    await prisma.attachment.deleteMany({ where: { taskId } }) // Borra archivos adjuntos
    await prisma.task.delete({ where: { id: taskId } })
    revalidatePath("/proyectos")
    return { success: true }
  } catch (error) {
    console.error("Error deleting task:", error)
    return { success: false, error: "Fail to DELETE" }
  }
}

export async function agregarProyecto(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string

  if (!name) {
    return { success: false, message: "Project name is required" }
  }

  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
      },
    })

    revalidatePath("/proyectos")
    return { success: true, data: newProject }
  } catch (error) {
    return { error, message: "Failed to create project" }
  }
}


/**
 * Eliminar un proyecto y todas sus tareas
 */
export async function eliminarProyecto(projectId: number) {
  try {
    await prisma.task.deleteMany({ where: { projectId } }) // Borra tareas relacionadas
    await prisma.project.delete({ where: { id: projectId } })
    revalidatePath("/proyectos")
    return { success: true }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { success: false, error: "Fail to DELETE" }
  }
}

/**
 * Modificar una tarea existente
 */
export async function modificarTarea(taskId: number, data: TaskUpdateData) {
  try {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data,
    })
    revalidatePath("/proyectos")
    return { success: true, data: updatedTask }
  } catch (error) {
    console.error("Error updating task:", error)
    return { success: false, error: "Fail to UPDATE" }
  }
}

/**
 * Modificar un proyecto existente
 */
export async function modificarProyecto(projectId: number, data: ProjectUpdateData) {
  try {
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data,
    })
    revalidatePath("/proyectos")
    return { success: true, data: updatedProject }
  } catch (error) {
    console.error("Error updating project:", error)
    return { success: false, error: "Fail to UPDATE" }
  }
}

/**
 * Subir una imagen y asociarla a una tarea
 */
export async function subirImagen(taskId: number, file: File) {
  try {
    const fileExtension = path.extname(file.name)
    const uniqueFileName = `${randomUUID()}${fileExtension}`
    const filePath = path.join("public/uploads", uniqueFileName)

    await prisma.$transaction(async (prisma) => {
      await writeFile(filePath, Buffer.from(await file.arrayBuffer()))

      await prisma.attachment.create({
        data: {
          fileUrl: `/uploads/${uniqueFileName}`,
          fileName: file.name,
          taskId,
        },
      })
    })

    revalidatePath("/proyectos")
    return { success: true, data: { fileURL: `/uploads/${uniqueFileName}` } }
  } catch (error) {
    console.error("Error uploading image:", error)
    if (error instanceof Error) {
      return { success: false, error: `Failed to upload: ${error.message}` }
    }
    return { success: false, error: "Unknown error occurred during upload" }
  }
}

