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
            <v-list>
              <v-subheader style="position:relative">
                Scripts
                <v-btn absolute right icon small @click="addScript()">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-subheader>
              <v-list-item
                v-for="(scr, name) of selected.labels"
                :key="name"
                @click="editLabel = name"
              >
                <v-list-item-content>
                  {{ name }}
                </v-list-item-content>
                <v-list-item-icon v-if="name == 'Main'">
                  <v-icon small>mdi-star</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-col>
        <v-divider inset vertical />
        <v-col>
          <script-editor
            :story.sync="selected.labels[editLabel]"
            :name="selected.name"
            :label="editLabel"
            :labels="Object.keys(selected.labels)"
            :npcs="npcs"
            @update-name="updateScriptName"
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
    },
    npcs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      editLabel: 'Main'
    }
  },
  computed: {
    spritePath() {
      return this.spritedata[this.selected.image]
    }
  },
  watch: {
    selected() {
      this.editLabel = 'Main'
    }
  },
  methods: {
    addScript() {
      this.$set(this.selected.labels, 'New Script', [''])
      this.editLabel = 'New Script'
    },
    updateScriptName(name) {
      if (!this.selected.labels[name]) {
        this.$set(
          this.selected.labels,
          name,
          this.selected.labels[this.editLabel]
        )
        this.$delete(this.selected.labels, this.editLabel)
        this.editLabel = name
      }
    }
  }
}
</script>

<style></style>
