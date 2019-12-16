<template>
  <v-row align="center" justify="center">
    <router-link to="/">
      <div class="full-cover" />
    </router-link>
    <v-card raised style="width:80%">
      <v-container>
        <v-row v-if="selected.nonpcs">
          <v-card-text>This map has no npcs.</v-card-text>
        </v-row>
        <v-row v-else>
          <v-col>
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
              <v-text-field label="Sprite" v-model="selected.image" />
              <v-img :src="spritePath" aspect-ratio="1">
                <template v-slot:placeholder>
                  <v-row align="center" justify="center">
                    <v-chip>The image isn't loaded.</v-chip>
                  </v-row>
                </template>
              </v-img>
              <v-text-field
                label="Spawn Condition"
                v-model="selected.spawn_condition"
              />
            </v-card-text>
          </v-col>
          <v-col>
            <script-editor
              :story.sync="selected.dialogue"
              :name="selected.name"
            />
          </v-col>
        </v-row>
      </v-container>
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
    }
  },
  computed: {
    spritePath() {
      //return '../images/' + this.sprite
      return require('@/assets/logo.png')
    }
  }
}
</script>

<style></style>
