<template>
  <v-row align="center" justify="center">
    <router-link to="/">
      <div class="full-cover" />
    </router-link>
    <v-card raised style="width:80%;" class="mt-4">
      <v-row v-if="selected.nonpcs" no-gutters>
        <v-card-text>This map has no npcs.</v-card-text>
      </v-row>
      <v-row v-else no-gutters>
        <v-col md="4">
          <v-card-title>
            <v-text-field
              label="Name"
              placeholder="Name"
              v-model="selected.name"
              outlined
              hide-details
            />
          </v-card-title>
          <v-card-text>
            <v-text-field
              label="Sprite"
              v-model="selected.image"
              hide-details
            />
            <v-img
              v-if="selected.image"
              :src="spritePath"
              aspect-ratio="1"
              class="crisp my-5"
              max-height="25vh"
              max-width="25vh"
            >
              <template v-slot:placeholder>
                <v-row align="center" justify="center">
                  <v-progress-circular indeterminate />
                </v-row>
              </template>
            </v-img>
            <v-chip v-else class="my-5">No sprite chosen.</v-chip>
            <v-text-field
              label="Spawn Condition"
              v-model="selected.spawn_condition"
            />
          </v-card-text>
        </v-col>
        <v-divider inset vertical />
        <v-col>
          <script-editor
            :story.sync="selected.dialogue"
            :name="selected.name"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-row>
</template>

<script>
import ScriptEditor from '@/components/ScriptEditor.vue'
export default {
  components: {
    'script-editor': ScriptEditor
  },
  props: {
    selected: {
      type: Object,
      required: true
    },
    spritedata: {
      type: Object,
      required: true
    }
  },
  computed: {
    spritePath() {
      return this.spritedata[this.selected.image]
    }
  }
}
</script>

<style></style>
