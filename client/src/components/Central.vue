<template>
  <b-container>
    <b-row class="text-center" style="height: 200px;">
      <b-col offset-md="1">
        <div id="keySelector">
          {{key}}
        </div>
        <div>
          <b-form-select v-model="key">
            <option v-for="key in signatures" :value="key">{{key}}</option>
          </b-form-select>
        </div>
        <b-button :pressed.sync="majorOrMinor" v-on:click="getTones()" variant="primary">Toggle Me</b-button>
        <p>Major: <strong>{{ majorOrMinor }}</strong></p>
      </b-col>
      <b-col cols="8">
        <b-row>
          <div class="chord" v-on:click="playOrAdd(0)">{{tones[0]}}</div>
          <div class="chord" v-on:click="playOrAdd(2)">{{tones[2]}}</div>
          <div class="chord" v-on:click="playOrAdd(5)">{{tones[5]}}</div>
        </b-row>
        <b-row>
          <div class="chord" v-on:click="playOrAdd(3)">{{tones[3]}}</div>
          <div class="chord" v-on:click="playOrAdd(1)">{{tones[1]}}</div>
        </b-row>
        <b-row>
          <div class="chord" v-on:click="playOrAdd(4)">{{tones[4]}}</div>
          <div class="chord" v-on:click="playOrAdd(6)">{{tones[6]}}</div>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="text-center">
      <b-col>
        <h1> Selected Chords </h1>
        <div id="selectedChords">
          <div v-for="chord in selectedChords" class="chord">{{chord}}
        </div>
        <b-button v-on:click="removeChord"> Remove </b-button>
        <b-button v-on:click="playChords" variant="primary"> Play </b-button>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import * as IS from "isnext";
import * as player from '../player';

export default {
  name: 'Central',
  data() {
    return {
      key: 'E',
      majorOrMinor: true,
      i: 0,
      tones: IS.progression.major,
      signatures: ['C', 'F', 'Bb', 'Eb', 'A', 'D', 'Gb', 'Cb', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'],
      selectedChords: [],
      numClicks: 0,
    }
  },
  methods: {
    getTones(){
      if (this.majorOrMinor){
        this.tones = IS.progression.major;
      } else {
        this.tones = IS.progression.minor;
      }
    },
    findChord(i){
      let tones;
      let result;
      result = IS.progression.get_chord_for_function(this.tones[i], this.key); 
      return result
    },
    playChords(){
      IS.progression.play_progression(this.selectedChords);
    },
    removeChord(){
      this.selectedChords.pop();
    },
    playOrAdd(i){
      const result = this.findChord(i);
      this.numClicks += 1
      if (this.numClicks === 1){
        const self = this;
        setTimeout(() => {
          switch (self.numClicks) {
              case 1:
                player.play_chord(result);
                break;
              default:
                this.selectedChords.push(result);
          }
          self.numClicks = 0;
        }, 200);
      }
    }
  },
};
</script>

<style>
#keySelector {
  width: 76px;
  height: 75px;
}

#selectorChords {
  display: flex;
  flex-direction: row;
}

#keySelector {
  border: dotted 3px #000;
}

#chords {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.chord {
  width: 50px;
  height: 50px;
  border: dotted 1px #000;
  margin: 2px;
  text-align: center;
}

#selectedChords {
  display: flex;
  flex-direction: row;
}
</style>
