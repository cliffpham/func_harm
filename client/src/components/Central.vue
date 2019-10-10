<template>
  <b-container>

    <b-row class="text-center" style="margin-bottom: 2%; border: dotted 1px #000;">
      <b-col offset-md="1" align-self="center">
        <div style="display: inline-block;">
          <div style="display: flex; flex-direction: row;">
            <div class="selectors">*Tempo</div>
            <div class="selectors">*Mixtures</div>
            <div class="selectors" v-on:click="getTones">Major or Minor</div>
            <div class="selectors">
              <b-form-select v-model="key" size="lg">
                <option v-for="key in signatures" :value="key">{{key}}</option>
              </b-form-select>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>

    <b-row class="text-center" style="margin-bottom: 2%;">
      <b-col align-self="center">
        <div id="keySelector">
          <div id="keyS"><h1 style="font-size: 5em;">{{key}}</h1></div>
        </div>
      </b-col>
      <b-col align-self="center">
        <b-row>
          <div class="chord tonic" v-on:click="playOrAdd(0)">{{tones[0]}}</div>
          <div class="chord tonic" v-on:click="playOrAdd(2)">{{tones[2]}}</div>
          <div class="chord tonic" v-on:click="playOrAdd(5)">{{tones[5]}}</div>
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

    <b-row class="text-center" style="border: dotted 1px #000;">
      <b-col align-self="start">
          <div style="display: flex; flex-direction: row;">
            <div id="selectedChords">
              <div class="buttons" v-on:click="playChords"><font-awesome-icon icon="play"/></div>
            <div class="buttons" v-on:click="removeChord"><font-awesome-icon icon="trash"/></div>
            </div>
            <div id="selectedChords">
              <div v-for="chord in selectedChords"
                   class="selectedChord"
                   v-on:click="play(chord[0])">
                  <h6>{{chord[1]}}</h6>
                  <p>{{chord[0]}}</p>
              </div>
          </div>
          </div>
      </b-col>
    </b-row>

  </b-container>
</template>

<script>
import * as IS from 'isnext';
import * as player from '../player';

export default {
  name: 'Central',
  data() {
    return {
      key: 'C',
      majorOrMinor: true,
      i: 0,
      tones: IS.progression.major,
      signatures: ['C', 'F', 'Bb', 'Eb', 'A', 'D', 'Gb', 'Cb', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'],
      selectedChords: [],
      numClicks: 0,
    };
  },
  methods: {
    getTones() {
      if (this.majorOrMinor) {
        this.tones = IS.progression.minor;
        this.majorOrMinor = false;
      } else {
        this.tones = IS.progression.major;
        this.majorOrMinor = true;
      }
    },
    findChord(i) {
      const result = IS.progression.get_chord_for_function(this.tones[i], this.key);
      return result;
    },
    play(chord) {
      player.play_chord(chord);
    },
    playChords() {
      const temp = [];
      for (let i = 0; i < this.selectedChords.length; i += 1) {
        temp.push(this.selectedChords[i][0]);
      }
      player.play_progression(temp);
    },
    removeChord() {
      this.selectedChords.pop();
    },
    playOrAdd(i) {
      const result = this.findChord(i);
      const funcHarm = this.tones[i];
      this.numClicks += 1;
      if (this.numClicks === 1) {
        const self = this;
        setTimeout(() => {
          switch (self.numClicks) {
            case 1:
              player.play_chord(result);
              break;
            default:
              self.selectedChords.push([result, funcHarm]);
          }
          self.numClicks = 0;
        }, 200);
      }
    },
  },
};
</script>

<style>
#keySelector {
  width: 150px;
  height: 150px;
  display: inline-block;
  border: dotted 3px #000;
}

#selectorChords {
  display: flex;
  flex-direction: row;
}

#chords {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#keyS {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
}

.selectors {
  width: 100px;
  height: 50px;
  border: dotted 1px #100;
  margin: 2px;
  text-align: center;
}

.buttons {
  width: 50px;
  height: 50px;
  border: dotted 1px #000;
  margin-top: 2px;
  margin-bottom: 2px;
  text-align: center;
  vertical-align: middle;
  line-height: 50px;
}

.chord {
  width: 150px;
  height: 50px;
  border: dotted 1px #000;
  margin: 2px;
  text-align: center;
  vertical-align: middle;
  line-height: 50px;
}

.tonic {
}

.selectedChord {
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
