<template>
  <div class="learning-object-card">
    <p>Title: {{ title }}</p>
    <p>ID: {{id}}</p>
    <p>Type: {{ type }}</p>
    <p>Description: {{ description }}</p>
    <p>Duration: {{ duration }}</p>
    <p>
      Link: <a :href="url">{{ url }}</a>
    </p>
    <ul>
      <li v-for="skill in skills" :key="skill.id">
        {{ skill.name }}: {{ skill.description }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import type { PropType } from "vue";
import { LearningObject } from "@/store/useLearningObjectsStore/types";
export default defineComponent({
  name: "LearningObjectCard",
  props: {
    learningObject: Object as PropType<LearningObject>,
  },
  setup(props) {
    return {
      ...props.learningObject,
    };
  },
});
</script>
<style lang="scss" scoped>
  .learning-object-card {
  border: 1px solid;
  padding: 10px;
}
</style>