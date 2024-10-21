import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { AbstractFileService } from "@medusajs/medusa"
import type { Multer } from "multer"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const fileService: AbstractFileService = req.scope.resolve("fileService")

  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    res.status(400).json({ message: "No file uploaded" })
    return
  }

  const file = req.files[0]

  try {
    const result = await fileService.upload(file)
    res.status(200).json({ url: result.url })
  } catch (error) {
    res.status(500).json({ message: "Error uploading file", error: error.message })
  }
}
