/* eslint-disable */

var normal = require("isnext").normal;
var Tone = require("tone");
var teoria = require("teoria");


var polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();


function get_chord(chord) {
  var teoria_chord;
  try {
  chord = normal.get_normal_chord(chord.name || chord);
  teoria_chord = teoria.chord(chord);
  } catch(e) {
    console.log("CANT DO CHORD", chord, e);
    return;
  }

  var chord_notes = teoria_chord.notes().map(function(n) { return n.toString() });
  return chord_notes;
}

var chordPart;
export function play_chord(chord, duration) {
  duration = duration || "4n"

  // octaves cost 12. so... the offsets will be...
  var chord_notes = get_chord(chord);
  polySynth.triggerAttackRelease(chord_notes, duration);
}
export function play_progression(chords) {
    chords = chords.map(function(c) { return get_chord(c); });
    chords = chords.map(function(c, i) { return [i, c] });
    if (chordPart) {
      chordPart.stop(0);
    }

    chordPart = new Tone.Part(function(time, chord){
      if (chord) {
        polySynth.triggerAttackRelease(chord, "2n");
      }
    }, chords);

    chordPart.loop = false;
    chordPart.start(0);
    Tone.Transport.bpm.value = 100;
    Tone.Transport.stop();
    Tone.Transport.start("+0.1");


}
