import learningObjectsData from '@/learning-objects.json';

export default defineEventHandler(() => {
  return Promise.resolve(learningObjectsData)
})