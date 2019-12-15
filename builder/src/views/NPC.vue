<template>
  <v-card raised>
    <v-container>
      <v-row>
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
          <script-editor :story="selected.dialogue" />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
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
