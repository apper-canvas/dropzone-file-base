import fileData from '../mockData/files.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let files = [...fileData]

const fileService = {
  async getAll() {
    await delay(300)
    return [...files]
  },

  async getById(id) {
    await delay(200)
    const file = files.find(f => f.id === id)
    if (!file) {
      throw new Error('File not found')
    }
    return { ...file }
  },

  async create(fileData) {
    await delay(400)
    const newFile = {
      ...fileData,
      id: fileData.id || Date.now().toString(),
      uploadedAt: fileData.uploadedAt || new Date().toISOString(),
      lastModified: fileData.lastModified || Date.now(),
      status: fileData.status || 'completed'
    }
    files.unshift(newFile)
    return { ...newFile }
  },

  async update(id, updateData) {
    await delay(300)
    const index = files.findIndex(f => f.id === id)
    if (index === -1) {
      throw new Error('File not found')
    }
    files[index] = { ...files[index], ...updateData }
    return { ...files[index] }
  },

  async delete(id) {
    await delay(250)
    const index = files.findIndex(f => f.id === id)
    if (index === -1) {
      throw new Error('File not found')
    }
    files.splice(index, 1)
    return true
  },

  async getByFolder(folderId) {
    await delay(300)
    return files.filter(f => f.folderId === folderId).map(f => ({ ...f }))
  },

  async search(query) {
    await delay(250)
    const searchTerm = query.toLowerCase()
    return files
      .filter(f => f.name.toLowerCase().includes(searchTerm))
      .map(f => ({ ...f }))
  }
}

export default fileService