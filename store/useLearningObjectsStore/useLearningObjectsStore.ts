import { defineStore } from "pinia";
import {
  LearningObject,
  UseLearningObjectsStoreProps,
  CategoryNode,
  IndexedSkillNode,
  IndexedCategoryTree,
  SetFilteredLearningObjectsParam,
  DuratonFilterRange,
} from "./types";

export const useLearningObjectsStore = defineStore<
  string,
  UseLearningObjectsStoreProps
>({
  id: "learningObjects-store",
  state: () => ({
    learningObjects: [],
    learningObjectsByNode: [],
    treeData: [],
    objectTypes: [],
    filters: {
      duration: null,
      activityType: null,
      nodeFilter: null
    },
    error: null,
    loading: false,
  }),
  actions: {
    async init() {
      await this.fetchLearningObjects();
      this.buildNodeTreeData();
      this.buildTypeSelectValues();
    },
    async fetchLearningObjects() {
      this.learningObjects = [];
      this.loading = true;
      try {
        this.learningObjects = await $fetch("/api/getLearningObjects");
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    buildNodeTreeData() {
      const categorisedSkills: IndexedCategoryTree = {};
      const clonedLearningObjects: LearningObject[] = this.learningObjects.map(
        (item) => JSON.parse(JSON.stringify(item))
      );
      clonedLearningObjects.map((object) => {
        object.skills.map((skill) => {
          const {
            category: { id: categoryId, name: categoryName },
            id,
          } = skill;
          delete skill.category;
          if (categorisedSkills[categoryId]) {
            if (!categorisedSkills[categoryId].children[id]) {
              skill.label = skill.name;
              delete skill.name;
              categorisedSkills[categoryId].children[id] = skill;
            }
          } else {
            const children: IndexedSkillNode = {};
            skill.label = skill.name;
            delete skill.name;
            children[id] = skill;
            categorisedSkills[categoryId] = {
              label: categoryName,
              id: "cat-" + categoryId,
              children,
            };
          }
        });
      });
      const formattedCategoryData: CategoryNode[] = Object.values(
        categorisedSkills
      ).map((category: any) => {
        return { ...category, children: Object.values(category.children) };
      });
      this.treeData = formattedCategoryData;
    },
    buildTypeSelectValues() {
      const types: Array<string> = this.learningObjects.map(
        (item) => item.type
      );
      const uniqueTypes = [...new Set(types)];
      this.objectTypes = uniqueTypes;
    },
    setFilteredLearningObjects(filterQuery: SetFilteredLearningObjectsParam) {
      const learningObjects: LearningObject[] = this.learningObjects;
      if (!filterQuery?.length) {
        this.learningObjectsByNode = [];
      }
      const catFilter: Array<number> = [];
      const skillFilter: Array<number> = [];
      const catPrefix = "cat-";
      filterQuery.forEach((item) => {
        const itemString = item.toString();
        itemString.includes(catPrefix)
          ? catFilter.push(parseInt(itemString.split(catPrefix)[1]))
          : skillFilter.push(parseInt(itemString));
      });
      this.learningObjectsByNode = learningObjects.filter((object) => {
        let match = false;
        object.skills.filter((skill) => {
          if (
            skillFilter.includes(skill.id) ||
            catFilter.includes(skill.category.id)
          ) {
            match = true;
          }
        });
        return match;
      });
    },
  },
  getters: {
    getLearningObjectsByNode: (state) => state.learningObjectsByNode,
    getNodeFilterValue: (state) => state.filters.nodeFilter,
    getDurationFilterRange: (state): DuratonFilterRange => {
      const { learningObjects } = state;
      const objectDurations = learningObjects.map((object) =>
        parseFloat(object.duration)
      );
      const uniqueObjectDurations = [...new Set(objectDurations)];
      const minDuration = Math.min.apply(null, uniqueObjectDurations);
      const maxValue = Math.max.apply(null, uniqueObjectDurations);
      return {
        min: minDuration,
        max: maxValue,
      };
    },
    getTypeSelectValues: (state) => {
      const { learningObjects } = state;
      const types = learningObjects.map((item) => item.type);
      const uniqueTypes = [...new Set(types)];
      return uniqueTypes;
    },
    getFilteredLearningObjectsByNode(state) {
      const {
        filters: { duration, activityType },
        learningObjects,
        learningObjectsByNode,
      } = state;
      let filteredLearningObjects = learningObjectsByNode.length
        ? learningObjectsByNode
        : learningObjects;

      const filterByType = (
        objects: LearningObject[],
        type: string
      ): LearningObject[] => {
        return objects.filter((object) => {
          return object.type === type;
        });
      };
      const filterByDuration = (objects, duration) => {
        /* TODO - use reduce and filter to get the resultsfilteredd by duration*/
        console.log(duration);
        return objects;
      };
      activityType
        ? (filteredLearningObjects = filterByType(
            filteredLearningObjects,
            activityType
          ))
        : null;
      duration
        ? (filteredLearningObjects = filterByDuration(
            filteredLearningObjects,
            duration
          ))
        : null;

      return filteredLearningObjects;
    },
  },
});
