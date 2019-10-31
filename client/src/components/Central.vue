<template>
  <b-container>
    <b-row class="text-center" style="margin-bottom: 2%">
      <b-col offset-md="1" align-self="center">
        <div style="display: inline-block;">
          <div style="display: flex; flex-direction: row;">
            <div class="selectors">
              <b-form-select v-model="dur" size="lg">
                <option v-for=" lens in noteLengths" v-bind:value="lens.value">{{lens.len}}</option>
              </b-form-select>
            </div>
            <div class="selectors key" v-on:click="getTones">Major/Minor</div>
            <div class="selectors">
              <b-form-select v-model="key" size="lg">
                <option v-for="key in signatures" :value="key">{{key}}</option>
              </b-form-select>
            </div>
            <div class="selectors key" v-on:click="activateNeg">Negative</div>
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
          <div v-bind:class="[negHarm ? 'chord tonic' : 'chord tonicNeg']" v-on:click="playOrAdd(0)">{{tones[0]}}</div>
          <div v-bind:class="[negHarm ? 'chord tonic' : 'chord tonicNeg']" v-on:click="playOrAdd(2)">{{tones[2]}}</div>
          <div v-bind:class="[negHarm ? 'chord tonic' : 'chord tonicNeg']" v-on:click="playOrAdd(5)">{{tones[5]}}</div>
        </b-row>
        <b-row>
          <div v-bind:class="[negHarm ? 'chord subdom' : 'chord subdomNeg']" v-on:click="playOrAdd(3)">{{tones[3]}}</div>
          <div v-bind:class="[negHarm ? 'chord subdom' : 'chord subdomNeg']" v-on:click="playOrAdd(1)">{{tones[1]}}</div>
        </b-row>
        <b-row>
          <div v-bind:class="[negHarm ? 'chord dom' : 'chord domNeg']" v-on:click="playOrAdd(4)">{{tones[4]}}</div>
          <div v-bind:class="[negHarm ? 'chord dom' : 'chord domNeg']" v-on:click="playOrAdd(6)">{{tones[6]}}</div>
        </b-row>
      </b-col>
    </b-row>

    <b-row class="text-center">
      <b-col offset-md="1">
          <div style="display: flex; flex-direction: row;">
            <div id="selectedChords">
              <div class="buttons" v-on:click="playChords"><font-awesome-icon icon="play"/></div>
              <div class="buttons" v-on:click="removeChords"><font-awesome-icon icon="trash"/></div>
            </div>
            <div id="chordDisplay">
              <div v-for="(chord, index) in selectedChords"
                   v-bind:key="chord"
                   class="selectedChord"
                   v-on:click="playOrRemove(chord[0], index)">
                  <h6>{{chord[1]}}</h6>
                  <h5>{{chord[0]}}</h5>
                  <h6>{{chord[2]}}</h6>
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
      negHarm: false,
      dur: '4n',
      i: 0,
      tones: IS.progression.major,
      signatures: ['C', 'F', 'Bb', 'Eb', 'A', 'D', 'Gb', 'Cb', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'],
      selectedChords: [],
      noteLengths: [
        { len: '1', value: '1n' },
        { len: '1/2', value: '2n' },
        { len: '1/4', value: '4n' },
        { len: '1/8', value: '8n' },
        { len: '1/16', value: '16n' },
        { len: '1/32', value: '32n'}
      ],
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
    activateNeg() {
      console.log('negative harm state: ' + this.negHarm);
      if (this.negHarm == false){
        this.negHarm = true;
      }
      else {
        this.negHarm = false;
      }
    },
    findChord(i) {
      const result = IS.progression.get_chord_for_function(this.tones[i], this.key);
      return result;
    },
    playChords() {
      const temp = [];
      for (let i = 0; i < this.selectedChords.length; i += 1) {
        temp.push(this.selectedChords[i][0]);
      }
      player.play_progression(temp);
    },
    removeChords() {
      this.selectedChords = [];
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
              console.log(player.get_chord(result));
              player.play_chord(result, this.dur);
              break;
            default:
              self.selectedChords.push([result, funcHarm, this.key]);
          }
          self.numClicks = 0;
        }, 200);
      }
    },
    playOrRemove(chord,i) {
      this.numClicks += 1;
      if (this.numClicks === 1) {
        const self = this;
        setTimeout(() => {
          switch (self.numClicks) {
            case 1:
              player.play_chord(chord, this.dur);
              break;
            default:
              this.selectedChords.splice(i,1);
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
  border: 0.3rem outset lightgrey;
  border-radius: 5px;
  -webkit-box-shadow: 11px 11px 5px -10px rgba(0,0,0,0.64);
  -moz-box-shadow: 11px 11px 5px -10px rgba(0,0,0,0.64);
  box-shadow: 11px 11px 5px -10px rgba(0,0,0,0.64);
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
  border: 1px outset lightgrey;
  border-radius: 5px;
  margin: 2px;
  text-align: center;
}

.key {
  vertical-align: middle;
  line-height: 50px;
  border: 1px outset lightgrey;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -user-select: none;
}

.buttons {
  width: 50px;
  height: 50px;
  border: 1px outset lightgrey;
  margin-top: 2px;
  margin-right: 2px;
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
  border: 1px outset lightgrey;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -user-select: none;
}

.tonic {
 background-color: #dedff1;
}

.tonicNeg {
 background-color: #d1ffe8;
}

.subdom {
 background-color: #4c4a73;
}

.subdomNeg {
 background-color: #04A662;
}

.dom {
  background-color: #242747;
  color: #FFF;
}

.domNeg {
 background-color: #006432;
 color: #FFF;
}

.selectedChord {
  width: 100px;
  height: 100px;
  border: solid 1px #000;
  text-align: center;
  background-color: #9492c1;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -user-select: none;
}

.selectedChordNeg {
  width: 100px;
  height: 100px;
  border: solid 1px #000;
  text-align: center;
  background-color: #lightgreen;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -user-select: none;
}
#selectedChords {
  display: flex;
  flex-direction: row;
}

#chordDisplay {
  padding-top: 2px;
  padding-left: 2px;
  display: grid;
  grid-template-rows: 100px;
  grid-template-columns: 100px 100px 100px 100px;
  grid-row-gap: 0.2em;
  grid-column-gap: 0.2em;
}
</style>
