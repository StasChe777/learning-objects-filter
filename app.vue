<template>
  <div>
    <div class="vue-tree">
      <h1>Node Tree Select and filtering</h1>
      <ul>
        <li>
          Assumption made that initially all learning objects shoud be rendered
        </li>
        <li>Potential improvement - self exclusion for filter options</li>
        <li>Tree Select Search by Skill Category / Skill Name</li>
        <li>Filtered Learning Objects will are rendered on select</li>
        <li>
          <span class="code-quote">buildTreeDataForVueTree</span> - prepares the
          category and skill data to the shape expected by
          <span class="code-quote">vue3-treeselect</span>. The returned data by
          this function can also be used to build a custom Node Tree Select.
        </li>
        <li>
          <span class="code-quote">getFilteredResultsVueTree</span> - filters
          Learning Objects based on the <span class="code-quote">id</span> of
          the selected node.
        </li>
        <li>
          <span class="code-quote">vue3-treeselect</span> is known to have
          issues, this library was used only for visual reference
        </li>
        <li>
          Vue components have been created only for visual reference of filterng
          behavior only
        </li>
      </ul>
      <client-only>
        <div class="vue-tree__controls">
          <treeselect
            v-model="filters.nodeFilter"
            :multiple="true"
            :options="treeData"
          />
          <select class="option-select" v-model="filters.activityType">
            <option :value="null" disabled hidden>Please Select</option>
            <option value="">Show All</option>
            <option
              v-for="activityType in getTypeSelectValues"
              :key="activityType"
            >
              {{ activityType }}
            </option>
          </select>
        </div>
        <div class="lessons__wrapper" v-if="getFilteredLearningObjectsByNode">
          <h2>
            Number of Results: {{ getFilteredLearningObjectsByNode.length }}
          </h2>
          <div class="lessons">
            <div
              class="lesson"
              v-for="learningObject in getFilteredLearningObjectsByNode"
              :key="learningObject.id"
            >
              <LearningObjectCard :learningObject="learningObject" />
            </div>
          </div>
        </div>
      </client-only>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useLearningObjectsStore } from "@/store/useLearningObjectsStore/useLearningObjectsStore";
import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";
export default defineComponent({
  components: {
    Treeselect,
  },
  setup() {
    const learningObjectsStore = useLearningObjectsStore();
    const {
      init: initLearningObjects,
      getFilterValueDuration,
      getByActivityIdId,
      getLearningObjects,
      getFilteredResults,
      filters,
      setFilteredLearningObjects,
    } = learningObjectsStore;
    const {
      getFilteredLearningObjectsByNode,
      getLearningObjectsByNode,
      getNodeFilterValue,
      getTypeSelectValues,
      treeData,
    } = storeToRefs(useLearningObjectsStore());
    const learningObjects = ref(null);
    const learningObjectsVue = ref(null);
    const skillSearchQuery = ref("");
    const handleSkillSearch = () => {
      learningObjects.value = getFilteredResults(skillSearchQuery.value);
    };
    const formattedTreeData = computed(() => {
      const formattedData = getLearningObjects.map((item) => {
        return {
          id: item.id,
          label: item.title,
          children: item.skills.map((skill) => {
            return {
              id: skill.id,
              label: skill.name,
            };
          }),
        };
      });
      return formattedData;
    });
    watch(getNodeFilterValue, () => {
      setFilteredLearningObjects(filters.nodeFilter);
    });
    initLearningObjects();

    return {
      handleSkillSearch,
      formattedTreeData,
      learningObjects,
      getFilterValueDuration,
      skillSearchQuery,
      getLearningObjectsByNode,
      getByActivityIdId,
      treeData,
      getFilteredLearningObjectsByNode,
      getTypeSelectValues,
      learningObjectsVue,
      filters,
    };
  },
});
</script>
<style lang="scss" scoped>
.code-quote {
  font-size: 12px;
  font-weight: normal;
  padding: 0px 4px;
  background-color: rgba(9, 30, 66, 0.08);
  border-radius: 3px;
}
.vue-tree {
  &__controls {
    display: flex;
    gap: 10px;
  }
}

.option-select {
  border-color: rgb(221, 221, 221);
}
.lessons {
  display: flex;
  flex-wrap: wrap;
  width: 95%;
  margin: auto;
  gap: 0.5%;
}
.lesson {
  flex-basis: 33%;
  margin-bottom: 0.5%;
}
</style>
