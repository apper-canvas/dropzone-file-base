import uploadProgressData from '../mockData/uploadProgress.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let uploadProgress = [...uploadProgressData]

const uploadProgressService = {
  async getAll() {
    await delay(200)
    return [...uploadProgress]
  },

  async getById(id) {
    await delay(150)
    const progress = uploadProgress.find(p => p.fileId === id)
    if (!progress) {
      throw new Error('Upload progress not found')
    }
    return { ...progress }
  },

  async create(progressData) {
    await delay(100)
    const newProgress = {
      ...progressData,
      fileId: progressData.fileId || Date.now().toString(),
      bytesUploaded: progressData.bytesUploaded || 0,
      percentage: progressData.percentage || 0,
      speed: progressData.speed || 0,
      timeRemaining: progressData.timeRemaining || 0
    }
    uploadProgress.push(newProgress)
    return { ...newProgress }
  },

  async update(fileId, updateData) {
    await delay(100)
    const index = uploadProgress.findIndex(p => p.fileId === fileId)
    if (index === -1) {
      throw new Error('Upload progress not found')
    }
    uploadProgress[index] = { ...uploadProgress[index], ...updateData }
    return { ...uploadProgress[index] }
  },

  async delete(fileId) {
    await delay(100)
    const index = uploadProgress.findIndex(p => p.fileId === fileId)
    if (index === -1) {
      throw new Error('Upload progress not found')
    }
    uploadProgress.splice(index, 1)
    return true
  }
}

export default uploadProgressService