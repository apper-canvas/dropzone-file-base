import folderData from '../mockData/folders.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let folders = [...folderData]

const folderService = {
  async getAll() {
    await delay(250)
    return [...folders]
  },

  async getById(id) {
    await delay(200)
    const folder = folders.find(f => f.id === id)
    if (!folder) {
      throw new Error('Folder not found')
    }
    return { ...folder }
  },

  async create(folderData) {
    await delay(300)
    const newFolder = {
      ...folderData,
      id: folderData.id || Date.now().toString(),
      createdAt: folderData.createdAt || new Date().toISOString(),
      fileCount: folderData.fileCount || 0
    }
    folders.push(newFolder)
    return { ...newFolder }
  },

  async update(id, updateData) {
    await delay(250)
    const index = folders.findIndex(f => f.id === id)
    if (index === -1) {
      throw new Error('Folder not found')
    }
    folders[index] = { ...folders[index], ...updateData }
    return { ...folders[index] }
  },

  async delete(id) {
    await delay(300)
    const index = folders.findIndex(f => f.id === id)
    if (index === -1) {
      throw new Error('Folder not found')
    }
    folders.splice(index, 1)
    return true
  },

  async getSubfolders(parentId) {
    await delay(200)
    return folders
      .filter(f => f.parentId === parentId)
      .map(f => ({ ...f }))
  }
}

export default folderService