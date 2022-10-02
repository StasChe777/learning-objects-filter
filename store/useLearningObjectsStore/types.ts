export interface LearningSkillCategory {
  id: number;
  name: string;
}

export type SetFilteredLearningObjectsParam = Array<string | number>;

export interface DuratonFilterRange {
  min: number;
  max: number;
}

export interface SkillNode {
  description: string;
  id: string;
  label: string;
}

export interface CategoryNode {
  children: SkillNode[];
  id: string;
  label: string;
}

export interface IndexedSkillNode {
  label?: string;
  id?: string;
  description?: string;
}

export interface IndexedCategoryTree {
  [catId: string]: IndexedCategoryNode;
}

export interface IndexedCategoryNode {
  label: string;
  id: string;
  children: IndexedSkillNode;
}

export interface LearningSkill {
  id: number;
  name?: string;
  description: string;
  category: LearningSkillCategory;
  label?: string;
}

export interface LearningObject {
  id: number;
  title?: string;
  description: string;
  duration: string;
  type: string;
  url: string;
  skills: LearningSkill[];
}

export interface LearnnigObjectsStoreFiltersState {
  duration: string | null;
  activityType: string | null;
  nodeFilter: SetFilteredLearningObjectsParam;
}

export interface UseLearningObjectsStoreProps {
  learningObjects: LearningObject[];
  learningObjectsByNode: LearningObject[] | null;
  treeData: CategoryNode[];
  objectTypes: string[];
  filters: LearnnigObjectsStoreFiltersState;
  error: unknown; // TODO
  loading: boolean;
}
