<template>
  <b-container>
    <b-row align-v="center" style="height: 200px;">
      <b-col offset-md="1">
        <div id="keySelector">
          {{key}}
        </div>
        <div>
          <b-form-select v-model="key">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="E">E</option>
          </b-form-select>
        </div>
        <b-button :pressed.sync="majorOrMinor" v-on:click="getTones()" variant="primary">Toggle Me</b-button>
        <p>Major: <strong>{{ majorOrMinor }}</strong></p>
      </b-col>
      <b-col cols="8">
        <b-row>
          <div id="chord" v-on:click="findChord(0)">{{tones[0]}}</div>
          <div id="chord" v-on:click="findChord(2)">{{tones[2]}}</div>
          <div id="chord" v-on:click="findChord(5)">{{tones[5]}}</div>
        </b-row>
        <b-row>
          <div id="chord" v-on:click="findChord(3)">{{tones[3]}}</div>
          <div id="chord" v-on:click="findChord(1)">{{tones[1]}}</div>
        </b-row>
        <b-row>
          <div id="chord" v-on:click="findChord(4)">{{tones[4]}}</div>
          <div id="chord" v-on:click="findChord(6)">{{tones[6]}}</div>
        </b-row>
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
      console.log(result);
      player.play_chord(result);
    },
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

#chord {
  width: 50px;
  height: 50px;
  border: dotted 1px #000;
  margin: 2px;
  text-align: center;
}
</style>
