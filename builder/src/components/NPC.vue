<template>
  <v-row align="center" justify="center">
    <div class="full-cover" @click="$emit('open-room-editor')" />
    <v-card raised class="center-card mt-4">
      <v-row v-if="selected.nonpcs" no-gutters>
        <v-card-text>This map has no npcs.</v-card-text>
      </v-row>
      <v-row v-else no-gutters>
        <v-col md="4">
          <v-card-title>
            <v-text-field
              label="Name"
              placeholder="Name"
              :value="selected.name"
              @input="updateName"
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
              :src="spritePath"
              aspect-ratio="1"
              class="crisp my-5"
              style="margin-left:20%"
              max-height="20vh"
              max-width="20vh"
            >
              <template v-slot:placeholder>
                <v-row v-if="selected.image" align="center" justify="center">
                  <v-progress-circular indeterminate />
                </v-row>
                <v-chip v-else class="my-5">No sprite chosen.</v-chip>
              </template>
            </v-img>
            <v-text-field
              label="Spawn Condition"
              v-model="selected.spawn_condition"
            />
            <v-list style="max-height:245px;overflow-y:scroll">
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
                @contextmenu.prevent="showRemovePrompt(name)"
              >
                <v-list-item-content>
                  {{ name }}
                </v-list-item-content>
                <v-list-item-icon v-if="name == 'Main'">
                  <v-icon small>mdi-star</v-icon>
                </v-list-item-icon>
                <v-list-item-icon v-if="name == 'Secondary'">
                  <v-icon small>mdi-star-outline</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list>
            <delete-menu v-model="removePrompt" @remove="removeScript" />
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
import DeleteMenu from '@/components/DeleteMenu.vue'
import ScriptEditor from '@/components/ScriptEditor.vue'
export default {
  components: {
    'delete-menu': DeleteMenu,
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
      removing: '',
      removePrompt: false,
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
    updateName(name) {
      let npcMatch = false
      for (let npc of this.npcs) {
        if (name == npc.name) npcMatch = true
      }
      if (name && !npcMatch) this.selected.name = name
    },
    addScript() {
      this.$set(this.selected.labels, 'New Script', [''])
      this.editLabel = 'New Script'
    },
    removeScript() {
      this.$delete(this.selected.labels, this.removing)
      this.editLabel = 'Main'
      this.removing = 'Main'
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
    },
    showRemovePrompt(name) {
      if (name != 'Main') {
        this.removePrompt = true
        this.removing = name
      }
    }
  }
}
</script>

<style></style>
